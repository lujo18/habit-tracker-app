import { View, Text, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import icons from '../../constants/icons'
import tailwindConfig from '../../tailwind.config'
import CreateJournalEntry from '../../components/CreateJournalEntry'
import { JournalEntryRepository, HabitsRepository } from '../../db/sqliteManager'
import JournalEntry from '../../components/JournalEntry'

const tailwindColors = tailwindConfig.theme.extend.colors

const Journal = () => {
  const EntryRepo = new JournalEntryRepository();
  const habitsRepo = new HabitsRepository();

  const [isEntryOpen, setIsEntryOpen] = useState(false)

  const [journalEntries, setJournalEntries] = useState([])


  // JOURNAL MODAL STATES
  const [entryId, setEntryId] = useState("")
  
  const [entryDate, setEntryDate] = useState(new Date())

  const [habits, setHabits] = useState([])

  const [entryTitle, setEntryTitle] = useState("")

  const [entryBody, setEntryBody] = useState("")

  const [linkedHabit, setLinkedHabit] = useState(null)


  useEffect(() => {
    const queryEntries = async () => {
      setJournalEntries(await EntryRepo.getAllEntries());

      const queryTallyHabits = await habitsRepo.queryHabits(entryDate);
      const queryQuitHabits = await habitsRepo.getAllHabits(); // Update to have a specific time shown (like day xyz or time that haven't done habit)
      setHabits([...queryTallyHabits, ...queryQuitHabits]);
    }
  

    queryEntries()
  }, [isEntryOpen])


  const changeEntryId = (value) => {
    entryId(value);
  }

  const changeEntryTitle = (value) => {
    setEntryTitle(value);
  } 

  const changeEntryBody = (value) => {
    setEntryBody(value);
  } 

  const changeLinkedHabit = (value) => {
    setLinkedHabit(value);
  }

  const onModalClose = async () => {


    if (!(entryTitle && entryBody)) {
      setIsEntryOpen(false)
      return
    }

    if (entryId) {
      await EntryRepo.updateEntry(entryId, entryTitle, entryBody, linkedHabit)
    }
    else {
      try {
        await EntryRepo.createNewEntry(entryTitle, entryBody, linkedHabit)
      }
      catch (error) {
        console.log("Failed to create journal entry: ", error)
      }
    }
    
    clearEntry();
    setIsEntryOpen(false)
  }

  const createJournalEntry = () => {
    setIsEntryOpen(true)
  }

  const editJournalEntry = async (id, date, title, body, habitId) => {
    setEntryId(id)
    setEntryDate(date)
    setEntryTitle(title)
    setEntryBody(body)
    setLinkedHabit(habitId)

    setIsEntryOpen(true)
  }

  const clearEntry = () => {
    setEntryId("");
    setEntryTitle("");
    setEntryBody("");
    setLinkedHabit(null);
  }

  return (
    <SafeAreaView className="bg-background h-full w-full px-4 flex-1">
      <View className="flex-row align-center  p-4">
        <View className="flex-1">

        </View>
        <View className="flex-1 items-center">
          <Text className="text-highlight text-2xl">Journal</Text>
        </View>
        <View className="flex-1 items-end">
          <TouchableOpacity className={`bg-background-80 p-4 rounded-full ${isEntryOpen ? "opacity-0" : ""}`} onPress={() => createJournalEntry()}>
            <Image 
              source={icons.addBox}
              className="w-9 h-9"
              resizeMode='cover'
              tintColor={tailwindColors["highlight"]["90"]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1">
        <FlatList 
          data={journalEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const habitName = habits.find(habit => habit.id === item.habitId)?.name || null;
            const habitColor = habits.find(habit => habit.id === item.habitId)?.color || null;
            return (
              <JournalEntry {...item} habitName={habitName} habitColor={habitColor} editEntry={editJournalEntry}/>
            );
          }}
        />
      </View>
      <CreateJournalEntry 
        isVisible={isEntryOpen} 
        onClose={onModalClose}
        habits={habits}
        entryTitle={entryTitle}
        entryBody={entryBody}
        linkedHabit={linkedHabit}
        changeEntryTitle={changeEntryTitle}
        changeEntryBody={changeEntryBody}
        changeLinkedHabit={changeLinkedHabit}
      />
    </SafeAreaView>
  )
}

export default Journal