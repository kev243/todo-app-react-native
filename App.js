import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { s } from "./App.style";
let isFirstRender = true;
let isLoadUpdate = false;
import { Header } from "./components/Header/Header";
import { CardTodo } from "./components/CardTodo/CardTodo";
import { useEffect, useState } from "react";
import { TabBottomMneu } from "./components/TabBottomMenu/TabBottomMenu";
import { ButtonAdd } from "./components/ButtonAdd/ButtonAdd";
import Dialog from "react-native-dialog";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [selectedTabName, setSelectedTabName] = useState("all");
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [todoList, setTodoList] = useState([]);
  useEffect(() => {
    loadTodoList();
  }, []);

  useEffect(() => {
    if (isLoadUpdate) {
      isLoadUpdate = false;
    }
    if (!isFirstRender) {
      saveTodoList();
    }
    isFirstRender = false;
  }, [todoList]);
  async function saveTodoList() {
    try {
      await AsyncStorage.setItem("@todolist", JSON.stringify(todoList));
    } catch (error) {
      alert("Erreur " + err);
    }
  }

  async function loadTodoList() {
    try {
      const stringifiedTodoList = await AsyncStorage.getItem("@todolist");
      if (stringifiedTodoList !== null) {
        const parsedTodoList = JSON.parse(stringifiedTodoList);
        isLoadUpdate = true;
        setTodoList(parsedTodoList);
      }
    } catch (error) {
      alert("Erreur " + err);
    }
  }

  function getFilteredList() {
    switch (selectedTabName) {
      case "all":
        return todoList;
      case "inProgress":
        return todoList.filter((todo) => !todo.isCompleted);
      case "done":
        return todoList.filter((todo) => todo.isCompleted);
    }
  }

  //finction pour mettre a jour une tache
  function updateTodo(todo) {
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };

    const indexToUpdate = todoList.findIndex(
      (todo) => todo.id === updatedTodo.id
    );

    const updatedTodoList = [...todoList];
    updatedTodoList[indexToUpdate] = updatedTodo;
    setTodoList(updatedTodoList);
  }

  //fonction pour supprimer une tache
  function deleteTodo(todoToDelete) {
    Alert.alert("Suppression", "Supprimer cette tâche?", [
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          setTodoList(todoList.filter((todo) => todo.id !== todoToDelete.id));
        },
      },
      {
        text: "Annuler",
        style: "cancel",
      },
    ]);
  }

  //fonction pour ajouter une tache
  function addTodo() {
    const newTodo = {
      id: uuid.v4(),
      title: inputValue,
      isCompleted: false,
    };

    setTodoList([...todoList, newTodo]);
    setIsAddDialogVisible(false);
  }

  //fonction pour afficher le dialogue
  function showAddDialog() {
    setIsAddDialogVisible(true);
  }

  //affichage de notre card todo
  function renderTodoList() {
    return getFilteredList().map((todo) => (
      <View style={s.cardItem} key={todo.id}>
        <CardTodo onLongPress={deleteTodo} onPress={updateTodo} todo={todo} />
      </View>
    ));
  }

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={s.app}>
          <View style={s.header}>
            <Header />
          </View>
          <View style={s.body}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderTodoList()}
            </ScrollView>
          </View>
          <ButtonAdd onPress={showAddDialog} />
        </SafeAreaView>
      </SafeAreaProvider>
      <View style={s.footer}>
        <TabBottomMneu
          todoList={todoList}
          onPress={setSelectedTabName}
          selectedTabName={selectedTabName}
        />

        <Dialog.Container
          visible={isAddDialogVisible}
          onBackdropPress={() => setIsAddDialogVisible(false)}
        >
          <Dialog.Title>Créer une tâche</Dialog.Title>
          <Dialog.Description>
            Choisi un nom pour la nouvelle tâche
          </Dialog.Description>
          <Dialog.Input onChangeText={setInputValue} />
          <Dialog.Button
            disabled={inputValue.trim().length === 0}
            label="Créer"
            onPress={addTodo}
          />
        </Dialog.Container>
      </View>
    </>
  );
}
