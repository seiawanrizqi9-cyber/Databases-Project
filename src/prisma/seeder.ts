import prismaInstance from '../prisma';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = prismaInstance;

async function main() {
  console.log('🌱 Mulai seeding database perpustakaan...');

  // Hapus data lama (opsional - uncomment jika ingin reset)
  // await prisma.borrowItem.deleteMany();
  // await prisma.borrowRecord.deleteMany();
  // await prisma.bookCategory.deleteMany();
  // await prisma.book.deleteMany();
  // await prisma.author.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.member.deleteMany();
  // await prisma.profile.deleteMany();
  // await prisma.user.deleteMany();

  // 1. Buat Users (25 users: 3 ADMIN + 22 USER)
  console.log('👤 Membuat users...');
  const users = [];
  const passwordHash = await bcrypt.hash('password123', 10);

  // Admin users
  for (let i = 0; i < 3; i++) {
    const user = await prisma.user.create({
      data: {
        username: `admin${i + 1}`,
        email: `admin${i + 1}@library.com`,
        password_hash: passwordHash,
        role: 'ADMIN',
      },
    });
    users.push(user);
  }

  // Regular users
  for (let i = 0; i < 22; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username({ firstName, lastName }).toLowerCase(),
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password_hash: passwordHash,
        role: 'USER',
      },
    });
    users.push(user);
  }
  console.log(`✅ Berhasil membuat ${users.length} users`);

  // 2. Buat Profiles untuk semua users
  console.log('👥 Membuat profiles...');
  const profiles = [];
  for (const user of users) {
    const profile = await prisma.profile.create({
      data: {
        user_id: user.id,
        name: faker.person.fullName(),
        gender: faker.helpers.arrayElement(['Laki-laki', 'Perempuan']),
        address: faker.location.streetAddress(true),
        profile_picture_url: faker.image.avatar(),
      },
    });
    profiles.push(profile);
  }
  console.log(`✅ Berhasil membuat ${profiles.length} profiles`);

  // 3. Buat Categories (15 kategori buku)
  console.log('📂 Membuat categories...');
  const categoryNames = [
    'Fiksi',
    'Non-Fiksi',
    'Sejarah',
    'Biografi',
    'Sains & Teknologi',
    'Bisnis & Ekonomi',
    'Pengembangan Diri',
    'Agama & Spiritual',
    'Seni & Musik',
    'Kuliner',
    'Pendidikan',
    'Anak & Remaja',
    'Psikologi',
    'Filsafat',
    'Hukum & Politik',
  ];

  const categories = [];
  for (const name of categoryNames) {
    const category = await prisma.category.create({
      data: { name },
    });
    categories.push(category);
  }
  console.log(`✅ Berhasil membuat ${categories.length} categories`);

  // 4. Buat Authors (40 penulis dari berbagai negara)
  console.log('✍️  Membuat authors...');
  const nationalities = [
    'Indonesia', 'Amerika Serikat', 'Inggris', 'Jepang', 'Korea Selatan',
    'Prancis', 'Jerman', 'Italia', 'Spanyol', 'Brasil',
    'Australia', 'Kanada', 'India', 'China', 'Rusia'
  ];

  const authors = [];
  for (let i = 0; i < 40; i++) {
    const authorName = faker.person.fullName();
    const nationality = faker.helpers.arrayElement(nationalities);
    
    const author = await prisma.author.create({
      data: {
        name: authorName,
        bio: faker.lorem.paragraphs(2),
        nationality: nationality,
      },
    });
    authors.push(author);
  }
  console.log(`✅ Berhasil membuat ${authors.length} authors`);

  // 5. Buat Books (120 buku dengan cover images)
  console.log('📚 Membuat books...');
  const genres = [
    'Romance', 'Mystery', 'Thriller', 'Fantasy', 'Science Fiction',
    'Horror', 'Historical Fiction', 'Adventure', 'Drama', 'Comedy',
    'Philosophy', 'Psychology', 'Self-Help', 'Biography', 'Memoir',
    'Travel', 'Cookbook', 'Poetry', 'Essay', 'Reference',
    'True Crime', 'Dystopian', 'Contemporary', 'Paranormal', 'Urban Fantasy'
  ];

  const books = [];
  for (let i = 0; i < 120; i++) {
    const book = await prisma.book.create({
      data: {
        title: faker.book.title(),
        description: faker.lorem.paragraphs(3),
        year: faker.number.int({ min: 1950, max: 2024 }),
        genre: faker.helpers.arrayElement(genres),
        price: faker.number.int({ min: 35000, max: 550000 }),
        stock: faker.number.int({ min: 1, max: 80 }),
        image_url: `https://picsum.photos/seed/${faker.string.uuid()}/400/600`,
        authorId: faker.helpers.arrayElement(authors).id,
      },
    });
    books.push(book);
  }
  console.log(`✅ Berhasil membuat ${books.length} books`);

  // 6. Buat BookCategory (relasi many-to-many)
  console.log('🔗 Membuat book-category relations...');
  let bookCategoryCount = 0;
  for (const book of books) {
    // Setiap buku punya 1-4 kategori
    const categoryCount = faker.number.int({ min: 1, max: 4 });
    const selectedCategories = faker.helpers.arrayElements(categories, categoryCount);

    for (const category of selectedCategories) {
      try {
        await prisma.bookCategory.create({
          data: {
            bookId: book.id,
            categoryId: category.id,
          },
        });
        bookCategoryCount++;
      } catch (error) {
        // Skip jika sudah ada (duplicate)
      }
    }
  }
  console.log(`✅ Berhasil membuat ${bookCategoryCount} book-category relations`);

  // 7. Buat Members (35 members untuk peminjaman)
  console.log('👥 Membuat members...');
  const members = [];
  for (let i = 0; i < 35; i++) {
    const member = await prisma.member.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        address: faker.location.streetAddress(true),
      },
    });
    members.push(member);
  }
  console.log(`✅ Berhasil membuat ${members.length} members`);

  // 8. Buat BorrowRecords dengan BorrowItems (50 peminjaman)
  console.log('📖 Membuat borrow records...');
  const borrowStatuses: ('ACTIVE' | 'RETURNED' | 'OVERDUE' | 'CANCELLED')[] = 
    ['ACTIVE', 'RETURNED', 'OVERDUE', 'CANCELLED'];
  const borrowRecords = [];
  let borrowItemCount = 0;

  for (let i = 0; i < 50; i++) {
    const borrowDate = faker.date.past({ years: 1 });
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 7, max: 21 })); // 7-21 hari

    const status = faker.helpers.arrayElement(borrowStatuses);
    let returnDate: Date | null = null;

    if (status === 'RETURNED') {
      // Dikembalikan antara borrow date dan due date
      returnDate = faker.date.between({ from: borrowDate, to: dueDate });
    } else if (status === 'OVERDUE') {
      // Sudah lewat due date tapi belum dikembalikan
      returnDate = null;
    } else if (status === 'CANCELLED') {
      // Cancelled sebelum due date
      returnDate = faker.date.between({ from: borrowDate, to: dueDate });
    }

    // Buat borrow record
    const borrowRecord = await prisma.borrowRecord.create({
      data: {
        memberId: faker.helpers.arrayElement(members).id,
        borrowDate,
        dueDate,
        returnDate,
        status,
      },
    });
    borrowRecords.push(borrowRecord);

    // Buat borrow items (1-4 buku per peminjaman)
    const itemCount = faker.number.int({ min: 1, max: 4 });
    const selectedBooks = faker.helpers.arrayElements(books, itemCount);

    for (const book of selectedBooks) {
      await prisma.borrowItem.create({
        data: {
          borrowRecordId: borrowRecord.id,
          bookId: book.id,
          quantity: faker.number.int({ min: 1, max: 2 }),
        },
      });
      borrowItemCount++;
    }
  }
  console.log(`✅ Berhasil membuat ${borrowRecords.length} borrow records`);
  console.log(`✅ Berhasil membuat ${borrowItemCount} borrow items`);

  // Summary
  console.log('\n✨ Seeding selesai!');
  console.log('📊 Summary:');
  console.log(`   - Users: ${users.length} (${users.filter(u => u.role === 'ADMIN').length} admin, ${users.filter(u => u.role === 'USER').length} user)`);
  console.log(`   - Profiles: ${profiles.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Authors: ${authors.length}`);
  console.log(`   - Books: ${books.length}`);
  console.log(`   - Book-Category Relations: ${bookCategoryCount}`);
  console.log(`   - Members: ${members.length}`);
  console.log(`   - Borrow Records: ${borrowRecords.length}`);
  console.log(`   - Borrow Items: ${borrowItemCount}`);
  console.log(`\n   📈 Total data: ${users.length + profiles.length + categories.length + authors.length + books.length + bookCategoryCount + members.length + borrowRecords.length + borrowItemCount}`);
  
  // Statistik tambahan
  const activeLoans = borrowRecords.filter(b => b.status === 'ACTIVE').length;
  const returnedLoans = borrowRecords.filter(b => b.status === 'RETURNED').length;
  const overdueLoans = borrowRecords.filter(b => b.status === 'OVERDUE').length;
  
  console.log('\n📊 Statistik Peminjaman:');
  console.log(`   - Active: ${activeLoans}`);
  console.log(`   - Returned: ${returnedLoans}`);
  console.log(`   - Overdue: ${overdueLoans}`);
  console.log(`   - Cancelled: ${borrowRecords.filter(b => b.status === 'CANCELLED').length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });