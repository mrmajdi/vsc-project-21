import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SubscriptionService } from './subscription.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class DownloadService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates a secure, time-limited mock download link for a piece of content.
   * @param userId - The ID of the user requesting the download.
   * @param contentId - The ID of the movie or episode.
   * @param type - The type of content ('movie' or 'episode').
   * @returns A promise that resolves to a secure download URL.
   * @throws If the user does not have an active subscription.
   */
  async generateDownloadLink(
    userId: string,
    contentId: string,
    type: 'movie' | 'episode',
  ): Promise<string> {
    // Verify subscription status
    const hasActive = await this.subscriptionService.hasActiveSubscription(userId);
    if (!hasActive) {
      throw new Error('User does not have an active subscription');
    }

    // Mock content mapping (in a real app, this would come from a DB or storage service)
    const mockContentMap: Record<string, { path: string; name: string }> = {
      // Example movies
      movie_1: { path: '/mock/movies/inception.mp4', name: 'Inception' },
      movie_2: { path: '/mock/movies/interstellar.mp4', name: 'Interstellar' },
      // Example episodes
      episode_1: { path: '/mock/episodes/breakingbad_s01e01.mp4', name: 'Breaking Bad S01E01' },
      episode_2: { path: '/mock/episodes/breakingbad_s01e02.mp4', name: 'Breaking Bad S01E02' },
    };

    const key = `${type}_${contentId}` as keyof typeof mockContentMap;
    const content = mockContentMap[key];
    if (!content) {
      throw new Error('Content not found');
    }

    // Create a payload for the signed URL
    const payload = {
      sub: userId,
      contentId,
      type,
      path: content.path,
      iat: Math.floor(Date.now() / 1000),
    };

    // Token expiry (e.g., 15 minutes)
    const expiresIn = this.configService.get<number>('DOWNLOAD_LINK_EXPIRY_IN_SECONDS', 900);
    const secret = this.configService.get<string>('JWT_DOWNLOAD_SECRET', 'default_download_secret');

    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });

    // Construct the mock download URL
    const baseUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');
    const downloadUrl = `${baseUrl}/api/download?token=${token}`;

    return downloadUrl;
  }

  /**
   * Validates a download token and returns the associated file path.
   * Used by the download controller to serve the file.
   * @param token - The JWT token received in the query string.
   * @returns Object containing the file path and name if valid.
   * @throws If token is invalid or expired.
   */
  async validateDownloadToken(token: string): Promise<{ path: string; name: string }>:
    Promise<{ path: string; name: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_DOWNLOAD_SECRET', 'default_download_secret'),
      });

      // Re-check subscription status at download time (optional but recommended)
      const hasActive = await this.subscriptionService.hasActiveSubscription(payload.sub);
      if (!hasActive) {
        throw new Error('User subscription is no longer active');
      }

      // In a real app, you would fetch the actual file path from storage.
      // Here we rely on the path stored in the token payload.
      // For mock purposes, we map back to a name.
      const mockNameMap: Record<string, string> = {
        '/mock/movies/inception.mp4': 'Inception',
        '/mock/movies/interstellar.mp4': 'Interstellar',
        '/mock/episodes/breakingbad_s01e01.mp4': 'Breaking Bad S01E01',
        '/mock/episodes/breakingbad_s01e02.mp4': 'Breaking Bad S01E02',
      };

      const name = mockNameMap[payload.path] || 'Unknown';

      return { path: payload.path, name };
    } catch (err) {
      throw new Error('Invalid or expired download token');
    }
  }
}