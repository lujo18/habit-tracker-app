import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView className="justify-center items-center w-full h-full bg-background">
      <Text className="text-2xl text-white">Habit Tracker</Text>
      <Link href="/home" className='text-blue-500 mt-5'>Testing</Link>
    </SafeAreaView>
  );
}
