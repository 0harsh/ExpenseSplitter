const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function clearDatabase() {
  try {
    console.log('🗑️  DATABASE CLEARING SCRIPT');
    console.log('============================');
    console.log('⚠️  WARNING: This will delete ALL data from your database!');
    console.log('📊 This includes:');
    console.log('   - All users');
    console.log('   - All groups');
    console.log('   - All expenses');
    console.log('   - All settlements');
    console.log('   - All friends');
    console.log('');
    
    const confirmation = await askQuestion('Are you sure you want to continue? Type "YES" to confirm: ');
    
    if (confirmation !== 'YES') {
      console.log('❌ Operation cancelled.');
      return;
    }
    
    const finalConfirmation = await askQuestion('This action cannot be undone. Type "DELETE ALL" to proceed: ');
    
    if (finalConfirmation !== 'DELETE ALL') {
      console.log('❌ Operation cancelled.');
      return;
    }
    
    console.log('');
    console.log('🗑️  Starting database cleanup...');
    
    // Delete all data in the correct order to respect foreign key constraints
    console.log('📝 Deleting settlements...');
    const settlementsDeleted = await prisma.settlement.deleteMany();
    console.log(`   Deleted ${settlementsDeleted.count} settlements`);
    
    console.log('💰 Deleting expense splits...');
    const splitsDeleted = await prisma.expenseSplit.deleteMany();
    console.log(`   Deleted ${splitsDeleted.count} expense splits`);
    
    console.log('💸 Deleting expenses...');
    const expensesDeleted = await prisma.expense.deleteMany();
    console.log(`   Deleted ${expensesDeleted.count} expenses`);
    
    console.log('👥 Deleting group members...');
    const membersDeleted = await prisma.groupMember.deleteMany();
    console.log(`   Deleted ${membersDeleted.count} group members`);
    
    console.log('👤 Deleting friends...');
    const friendsDeleted = await prisma.friend.deleteMany();
    console.log(`   Deleted ${friendsDeleted.count} friends`);
    
    console.log('🏠 Deleting groups...');
    const groupsDeleted = await prisma.group.deleteMany();
    console.log(`   Deleted ${groupsDeleted.count} groups`);
    
    console.log('👤 Deleting users...');
    const usersDeleted = await prisma.user.deleteMany();
    console.log(`   Deleted ${usersDeleted.count} users`);
    
    console.log('');
    console.log('✅ Database cleared successfully!');
    console.log('📊 Summary:');
    console.log(`   - Users: ${usersDeleted.count}`);
    console.log(`   - Groups: ${groupsDeleted.count}`);
    console.log(`   - Friends: ${friendsDeleted.count}`);
    console.log(`   - Group Members: ${membersDeleted.count}`);
    console.log(`   - Expenses: ${expensesDeleted.count}`);
    console.log(`   - Expense Splits: ${splitsDeleted.count}`);
    console.log(`   - Settlements: ${settlementsDeleted.count}`);
    console.log('');
    console.log('🎉 All data has been removed from the database.');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Run the script
clearDatabase();

