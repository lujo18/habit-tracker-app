import { View, Text, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import icons from '../../constants/icons'
import tailwindConfig from '../../tailwind.config'
import CreateJournalEntry from '../../components/CreateJournalEntry'
import { JournalEntryRepository, HabitsRepository, dateToSQL } from '../../db/sqliteManager'
import JournalEntry from '../../components/JournalEntry'

const tailwindColors = tailwindConfig.theme.extend.colors

const Journal = () => {
  const EntryRepo = new JournalEntryRepository();
  const habitsRepo = new HabitsRepository();

  const [isEntryOpen, setIsEntryOpen] = useState(false)

  const [journalEntries, setJournalEntries] = useState([])


  // JOURNAL MODAL STATES
  const [entryId, setEntryId] = useState("")

  const [habits, setHabits] = useState([])

  const [entryTitle, setEntryTitle] = useState("")

  const [entryBody, setEntryBody] = useState("")

  const [linkedHabit, setLinkedHabit] = useState(null)


  useEffect(() => {
    const queryEntries = async () => {
      setJournalEntries(await EntryRepo.getAllEntries());
      setHabits(await habitsRepo.queryHabits(await dateToSQL(new Date())));
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

  const changeLinkedHabit = () => {
    setLinkedHabit();
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
      await EntryRepo.createNewEntry(entryTitle, entryBody, linkedHabit)
    }
    
    clearEntry();
    setIsEntryOpen(false)
  }

  const createJournalEntry = () => {
    setIsEntryOpen(true)
  }

  const editJournalEntry = async (id, title, body, habitId) => {
    setEntryId(id)
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
        <View className="flex-1">
          <Text className="text-highlight-90 text-xl">Journal</Text>
        </View>
        <View className="">
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
          renderItem={({ item }) => (
            <JournalEntry {...item} editEntry={editJournalEntry}/>
          )}
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