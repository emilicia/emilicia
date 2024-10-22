import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { ContextProvider } from "@/context/Context";


const DATABASE_NAME = 'position-renting-system.db'
const expoDB = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true })
const db = drizzle(expoDB)

export default function RootLayout() {

  const { success, error } = useMigrations(db, migrations)

  useDrizzleStudio(expoDB)

  return (
  <SQLiteProvider databaseName = {DATABASE_NAME}>
      <ContextProvider>
        <Stack screenOptions = {{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" options = {{ headerShown: false }} />
        </Stack>
      </ContextProvider>
    </SQLiteProvider>
  );
}
