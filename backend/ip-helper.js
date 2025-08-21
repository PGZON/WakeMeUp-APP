/**
 * Utility script to display IP addresses for connecting from physical devices
 */
const os = require('os');
const interfaces = os.networkInterfaces();
const addresses = [];

console.log('\n🌐 Available IP addresses for connecting from physical devices:');
console.log('--------------------------------------------------------------');

// Get all network interfaces
for (const iface of Object.values(interfaces)) {
  if (!iface) continue;
  
  for (const alias of iface) {
    // Skip internal and non-IPv4 addresses
    if (alias.internal || alias.family !== 'IPv4') continue;
    
    console.log(`   - ${alias.address} (${alias.cidr})`);
    addresses.push(alias.address);
  }
}

console.log('\n📱 For physical device testing:');
if (addresses.length > 0) {
  console.log(`   Set EXPO_PUBLIC_API_BASE_URL=http://${addresses[0]}:3000/api in .env`);
  console.log(`   Access your API at: http://${addresses[0]}:3000/api`);
} else {
  console.log('   No suitable network interfaces found');
}

console.log('\n🖥️ For emulator testing:');
console.log('   Set EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000/api in .env');
console.log('   (Android emulator) or http://localhost:3000/api (iOS simulator)');

console.log('\n--------------------------------------------------------------\n');
