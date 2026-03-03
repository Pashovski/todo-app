import { useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Todo = { id: string; text: string; completed: boolean };

export default function TasksScreen() {
  const colorScheme = useColorScheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    const trimmed = inputText.trim();
    if (trimmed === '') return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputText('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Tasks</ThemedText>
      </ThemedView>

      <View style={[styles.inputRow, { backgroundColor: themeColors.background }]}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: themeColors.border,
              backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
              color: themeColors.text,
            },
          ]}
          placeholder="Add a new task..."
          placeholderTextColor={themeColors.icon}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTodo}
        />
        <Pressable
          style={[styles.addButton, { backgroundColor: themeColors.tint }]}
          onPress={addTodo}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.todoItem,
              {
                borderBottomColor: themeColors.border,
                backgroundColor: themeColors.background,
              },
            ]}
          >
            <Pressable
              style={[
                styles.checkbox,
                {
                  borderColor: item.completed ? themeColors.tint : themeColors.icon,
                  backgroundColor: item.completed ? themeColors.tint : 'transparent',
                },
              ]}
              onPress={() => toggleTodo(item.id)}
            />
            <ThemedText
              style={[
                styles.todoText,
                item.completed && {
                  textDecorationLine: 'line-through',
                  color: themeColors.completed,
                },
              ]}
            >
              {item.text}
            </ThemedText>
            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteTodo(item.id)}
            >
              <ThemedText style={{ color: themeColors.icon }}>×</ThemedText>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={{ color: themeColors.icon }}>No tasks yet</ThemedText>
          </View>
        }
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  addButton: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#fff',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
});
