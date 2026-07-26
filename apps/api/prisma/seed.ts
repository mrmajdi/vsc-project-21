import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data (order matters due to foreign keys)
  await prisma.movie.deleteMany()
  await prisma.series.deleteMany()
  await prisma.genre.deleteMany()
  await prisma.user.deleteMany()

  // Create genres
  const genreNames = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
    'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
  ]

  const genres = await Promise.all(
    genreNames.map(name => prisma.genre.create({ data: { name } }))
  )
  console.log(`✅ Created ${genres.length} genres`)

  // Helper to pick random items
  const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
  const randomItems = <T>(arr: T[], min = 1, max = arr.length): T[] => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN',
        password: '$2a$10$8JkZvZ6X6X6X6X6X6X6X6eEeEeEeEeEeEeEeEeEeEeEeEeEeEeEe', // password: secret123 (bcrypt)
      },
    }),
    prisma.user.create({
      data: {
        email: 'user1@example.com',
        name: 'Mohammad User',
        role: 'USER',
        password: '$2a$10$8JkZvZ6X6X6X6X6X6X6X6eEeEeEeEeEeEeEeEeEeEeEeEeEeEeEe',
      },
    }),
    prisma.user.create({
      data: {
        email: 'user2@example.com',
        name: 'Sara User',
        role: 'USER',
        password: '$2a$10$8JkZvZ6X6X6X6X6X6X6X6eEeEeEeEeEeEeEeEeEeEeEeEeEeEeEe',
      },
    }),
  ])
  console.log(`✅ Created ${users.length} users`)

  // Create movies
  const moviesData = [
    {
      title: 'فیلم نمونه ۱',
      description: 'توضیح کوتاه درباره فیلم نمونه اول.',
      releaseYear: 2022,
      rating: 8.5,
      posterUrl: 'https://via.placeholder.com/300x450?title=Movie+1',
      backdropUrl: 'https://via.placeholder.com/1280x720?title=Movie+1+Backdrop',
    },
    {
      title: 'فیلم نمونه ۲',
      description: 'توضیح کوتاه درباره فیلم نمونه دوم.',
      releaseYear: 2021,
      rating: 7.9,
      posterUrl: 'https://via.placeholder.com/300x450?title=Movie+2',
      backdropUrl: 'https://via.placeholder.com/1280x720?title=Movie+2+Backdrop',
    },
    {
      title: 'فیلم نمونه ۳',
      description: 'توضیح کوتاه درباره فیلم نمونه سوم.',
      releaseYear: 2020,
      rating: 9.0,
      posterUrl: 'https://via.placeholder.com/300x450?title=Movie+3',
      backdropUrl: 'https://via.placeholder.com/1280x720?title=Movie+3+Backdrop',
    },
    {
      title: 'فیلم نمونه ۴',
      description: 'توضیح کوتاه درباره فیلم نمونه چهارم.',
      releaseYear: 2019,
      rating: 6.8,
      posterUrl: 'https://via.placeholder.com/300x450?title=Movie+4',
      backdropUrl: 'https://via.placeholder.com/1280x720?title=Movie+4+Backdrop',
    },
    {
      title: 'فیلم نمونه ۵',
      description: 'توضیح کوتاه درباره فیلم نمونه پنجم.',
      releaseYear: 2018,
      rating: 8.2,
      posterUrl: 'https://via.placeholder.com/300x450?title=Movie+5',
      backdropUrl: 'https://via.placeholder.com/1280x720?title=Movie+5+Backdrop',
    },
  ]

  const movies = await Promise.all(
    moviesData.map(movie =>
      prisma.movie.create({
        data: {
          ...movie,
          genres: {
            connect: randomItems(genres, 1, 3).map(g => ({ id: g.id })),
          },
          createdBy: {
            connect: { id: randomItem(users).id },
          },
        },
      })
    )
  )
  console.log(`✅ Created ${movies.length} movies`)

  // Create series
  const seriesData = [
    {
      title: 'سریال نمونه ۱',
      description: 'توضیح کوتاه درباره سریال نمونه اول.',
      releaseYear: 2022,
      rating: 8.7,
      posterUrl: 'https://via.placeholder.com/300x450?title=Series+1',
      backdropUrl: 'https://via.placeholder.com/1280x720?title=Series+1+Backdrop',
      seasons: 2,
    },
    {
      title: 'سریال نمونه ۲',
      description: 'توضیح کوتاه درباره سریال نمونه دوم.',
      releaseYear: 2021,
      rating: 8.0,
      posterUrl: 'https://via.placeholder.com/300x450?title=Series+2',
      backdropUrl: 'https://via.placeholder.com/1280x720?title=Series+2+Backdrop',
      seasons: 1,
    },
    {
      title: 'سریال نمونه ۳',
      description: 'توضیح کوتاه درباره سریال نمونه سوم.',
      releaseYear: 2020,
      rating: 9.2,
      posterUrl: 'https://via.placeholder.com/300x450?title=Series+3',
      backdropUrl: 'https://via.placeholder.com/1280x720?title=Series+3+Backdrop',
      seasons: 3,
    },
  ]

  const series = await Promise.all(
    seriesData.map(ser =>
      prisma.series.create({
        data: {
          ...ser,
          genres: {
            connect: randomItems(genres, 1, 3).map(g => ({ id: g.id })),
          },
          createdBy: {
            connect: { id: randomItem(users).id },
          },
        },
      })
    )
  )
  console.log(`✅ Created ${series.length} series`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })