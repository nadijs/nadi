# Todo App Example

A complete todo application demonstrating CRUD operations, filtering, and local storage persistence.

## Live Demo

<div class="demo-container">
  <iframe src="/examples/todo.html" width="100%" height="500px"></iframe>
</div>

## Complete Todo App

Full-featured todo application with add, edit, delete, complete, and filter functionality.

```typescript
import { signal, computed, effect } from '@nadi/core'

type Todo = {
  id: number
  text: string
  completed: boolean
  createdAt: number
}

type Filter = 'all' | 'active' | 'completed'

function TodoApp() {
  // Load from localStorage
  const savedTodos = localStorage.getItem('todos')
  const todos = signal<Todo[]>(savedTodos ? JSON.parse(savedTodos) : [])
  const filter = signal<Filter>('all')
  const inputText = signal('')
  const editingId = signal<number | null>(null)
  const editText = signal('')

  // Auto-save to localStorage
  effect(() => {
    localStorage.setItem('todos', JSON.stringify(todos()))
  })

  // Computed values
  const filteredTodos = computed(() => {
    const allTodos = todos()
    switch (filter()) {
      case 'active':
        return allTodos.filter(t => !t.completed)
      case 'completed':
        return allTodos.filter(t => t.completed)
      default:
        return allTodos
    }
  })

  const activeCount = computed(() =>
    todos().filter(t => !t.completed).length
  )

  const completedCount = computed(() =>
    todos().filter(t => t.completed).length
  )

  // Actions
  const addTodo = () => {
    const text = inputText().trim()
    if (!text) return

    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: Date.now()
    }

    todos.set([...todos(), newTodo])
    inputText.set('')
  }

  const toggleTodo = (id: number) => {
    todos.set(todos().map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    todos.set(todos().filter(todo => todo.id !== id))
  }

  const startEdit = (todo: Todo) => {
    editingId.set(todo.id)
    editText.set(todo.text)
  }

  const saveEdit = () => {
    const id = editingId()
    const text = editText().trim()

    if (id && text) {
      todos.set(todos().map(todo =>
        todo.id === id ? { ...todo, text } : todo
      ))
    }

    editingId.set(null)
    editText.set('')
  }

  const cancelEdit = () => {
    editingId.set(null)
    editText.set('')
  }

  const clearCompleted = () => {
    todos.set(todos().filter(todo => !todo.completed))
  }

  const toggleAll = () => {
    const allCompleted = todos().every(t => t.completed)
    todos.set(todos().map(todo => ({ ...todo, completed: !allCompleted })))
  }

  return (
    <div class="todo-app">
      <h1>Todos</h1>

      {/* Input */}
      <div class="todo-input">
        <input
          type="text"
          value={inputText()}
          oninput={(e) => inputText.set((e.target as HTMLInputElement).value)}
          onkeypress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
        />
        <button onclick={addTodo}>Add</button>
      </div>

      {/* Filters */}
      <div class="filters">
        <button
          class={filter() === 'all' ? 'active' : ''}
          onclick={() => filter.set('all')}
        >
          All ({todos().length})
        </button>
        <button
          class={filter() === 'active' ? 'active' : ''}
          onclick={() => filter.set('active')}
        >
          Active ({activeCount()})
        </button>
        <button
          class={filter() === 'completed' ? 'active' : ''}
          onclick={() => filter.set('completed')}
        >
          Completed ({completedCount()})
        </button>
      </div>

      {/* Todo List */}
      <div class="todo-list">
        {filteredTodos().length === 0 ? (
          <p class="empty">No todos yet!</p>
        ) : (
          <ul>
            {filteredTodos().map(todo => (
              <li key={todo.id} class={todo.completed ? 'completed' : ''}>
                {editingId() === todo.id ? (
                  <div class="edit-mode">
                    <input
                      type="text"
                      value={editText()}
                      oninput={(e) => editText.set((e.target as HTMLInputElement).value)}
                      onkeypress={(e) => e.key === 'Enter' && saveEdit()}
                      onkeydown={(e) => e.key === 'Escape' && cancelEdit()}
                      autofocus
                    />
                    <button onclick={saveEdit}>Save</button>
                    <button onclick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <div class="view-mode">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onchange={() => toggleTodo(todo.id)}
                    />
                    <span ondblclick={() => startEdit(todo)}>{todo.text}</span>
                    <button onclick={() => deleteTodo(todo.id)}>×</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {todos().length > 0 && (
        <div class="footer">
          <button onclick={toggleAll}>
            {todos().every(t => t.completed) ? 'Uncheck All' : 'Check All'}
          </button>

          {completedCount() > 0 && (
            <button onclick={clearCompleted}>
              Clear Completed ({completedCount()})
            </button>
          )}
        </div>
      )}
    </div>
  )
}
```

## Todo with Categories

Organize todos into categories.

```typescript
type CategoryTodo = Todo & { category: string }

function CategorizedTodoApp() {
  const todos = signal<CategoryTodo[]>([])
  const categories = computed(() =>
    [...new Set(todos().map(t => t.category))]
  )
  const selectedCategory = signal<string | null>(null)

  const filteredTodos = computed(() => {
    const category = selectedCategory()
    return category
      ? todos().filter(t => t.category === category)
      : todos()
  })

  const addTodo = (text: string, category: string) => {
    todos.set([...todos(), {
      id: Date.now(),
      text,
      category,
      completed: false,
      createdAt: Date.now()
    }])
  }

  return (
    <div class="todo-app">
      {/* Categories */}
      <div class="categories">
        <button onclick={() => selectedCategory.set(null)}>
          All
        </button>
        {categories().map(cat => (
          <button
            key={cat}
            class={selectedCategory() === cat ? 'active' : ''}
            onclick={() => selectedCategory.set(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Todo list filtered by category */}
      {/* ... */}
    </div>
  )
}
```

## Todo with Priority

Add priority levels to todos.

```typescript
type PriorityTodo = Todo & { priority: 'low' | 'medium' | 'high' }

function PriorityTodoApp() {
  const todos = signal<PriorityTodo[]>([])

  const sortedTodos = computed(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return [...todos()].sort((a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority]
    )
  })

  const addTodo = (text: string, priority: PriorityTodo['priority']) => {
    todos.set([...todos(), {
      id: Date.now(),
      text,
      priority,
      completed: false,
      createdAt: Date.now()
    }])
  }

  return (
    <div class="todo-app">
      <ul class="todo-list">
        {sortedTodos().map(todo => (
          <li key={todo.id} class={`priority-${todo.priority}`}>
            <span class="priority-badge">{todo.priority}</span>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Todo with Due Dates

Add deadlines to todos.

```typescript
type DueDateTodo = Todo & { dueDate?: Date }

function DueDateTodoApp() {
  const todos = signal<DueDateTodo[]>([])

  const overdueTodos = computed(() => {
    const now = new Date()
    return todos().filter(t =>
      !t.completed && t.dueDate && t.dueDate < now
    )
  })

  const upcomingTodos = computed(() => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    return todos().filter(t =>
      !t.completed && t.dueDate && t.dueDate >= now && t.dueDate <= tomorrow
    )
  })

  const addTodoWithDueDate = (text: string, dueDate: string) => {
    todos.set([...todos(), {
      id: Date.now(),
      text,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      completed: false,
      createdAt: Date.now()
    }])
  }

  const formatDueDate = (date?: Date) => {
    if (!date) return ''
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))

    if (days < 0) return `${Math.abs(days)} days overdue`
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `Due in ${days} days`
  }

  return (
    <div class="todo-app">
      {/* Overdue section */}
      {overdueTodos().length > 0 && (
        <div class="overdue-section">
          <h2>Overdue ({overdueTodos().length})</h2>
          <ul>
            {overdueTodos().map(todo => (
              <li key={todo.id} class="overdue">
                {todo.text}
                <span class="due-date">{formatDueDate(todo.dueDate)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upcoming section */}
      {upcomingTodos().length > 0 && (
        <div class="upcoming-section">
          <h2>Due Soon ({upcomingTodos().length})</h2>
          <ul>
            {upcomingTodos().map(todo => (
              <li key={todo.id}>
                {todo.text}
                <span class="due-date">{formatDueDate(todo.dueDate)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* All todos */}
      {/* ... */}
    </div>
  )
}
```

## Todo with Subtasks

Nested todo items with subtasks.

```typescript
type SubtaskTodo = Todo & {
  subtasks: Todo[]
  parentId?: number
}

function SubtaskTodoApp() {
  const todos = signal<SubtaskTodo[]>([])

  const rootTodos = computed(() =>
    todos().filter(t => !t.parentId)
  )

  const addSubtask = (parentId: number, text: string) => {
    const subtask: SubtaskTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: Date.now(),
      subtasks: [],
      parentId
    }

    todos.set(todos().map(todo =>
      todo.id === parentId
        ? { ...todo, subtasks: [...todo.subtasks, subtask] }
        : todo
    ))
  }

  const toggleWithSubtasks = (id: number) => {
    const todo = todos().find(t => t.id === id)
    if (!todo) return

    const newCompleted = !todo.completed

    todos.set(todos().map(t =>
      t.id === id || t.parentId === id
        ? { ...t, completed: newCompleted }
        : t
    ))
  }

  const TodoItem = ({ todo }: { todo: SubtaskTodo }) => (
    <li class={todo.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={todo.completed}
        onchange={() => toggleWithSubtasks(todo.id)}
      />
      <span>{todo.text}</span>

      {todo.subtasks.length > 0 && (
        <ul class="subtasks">
          {todo.subtasks.map(subtask => (
            <TodoItem key={subtask.id} todo={subtask} />
          ))}
        </ul>
      )}

      <button onclick={() => {
        const text = prompt('Subtask:')
        if (text) addSubtask(todo.id, text)
      }}>
        + Add Subtask
      </button>
    </li>
  )

  return (
    <div class="todo-app">
      <ul class="todo-list">
        {rootTodos().map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  )
}
```

## Styling

```css
.todo-app {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
}

.todo-app h1 {
  margin: 0 0 1.5rem;
  text-align: center;
  color: #333;
}

.todo-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.todo-input input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.todo-input button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filters button {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.filters button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.todo-list {
  margin-bottom: 1rem;
}

.todo-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.todo-list li.completed span {
  text-decoration: line-through;
  color: #999;
}

.view-mode {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.view-mode input[type='checkbox'] {
  width: 20px;
  height: 20px;
}

.view-mode span {
  flex: 1;
  cursor: pointer;
}

.view-mode button {
  padding: 0.25rem 0.5rem;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.25rem;
}

.edit-mode {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.edit-mode input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #007bff;
  border-radius: 4px;
}

.footer {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.footer button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-right: 0.5rem;
}

.priority-high .priority-badge {
  background: #dc3545;
  color: white;
}

.priority-medium .priority-badge {
  background: #ffc107;
  color: black;
}

.priority-low .priority-badge {
  background: #28a745;
  color: white;
}

.overdue {
  background: #ffe6e6;
}

.due-date {
  font-size: 0.875rem;
  color: #666;
  margin-left: auto;
}

.subtasks {
  margin-left: 2rem;
  margin-top: 0.5rem;
}
```

## Testing

```typescript
import { render, fireEvent } from '@nadi/testing'
import userEvent from '@testing-library/user-event'

describe('TodoApp', () => {
  test('adds new todo', async () => {
    const user = userEvent.setup()
    const { getByPlaceholderText, getByText, getByRole } = render(() => <TodoApp />)

    const input = getByPlaceholderText('What needs to be done?')
    const addButton = getByRole('button', { name: 'Add' })

    await user.type(input, 'Buy groceries')
    await user.click(addButton)

    expect(getByText('Buy groceries')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  test('toggles todo completion', () => {
    const { getByText, getByRole } = render(() => <TodoApp />)

    // Add todo first
    fireEvent.input(getByPlaceholderText('What needs to be done?'), {
      target: { value: 'Test todo' }
    })
    fireEvent.click(getByRole('button', { name: 'Add' }))

    const checkbox = getByRole('checkbox')
    const todoText = getByText('Test todo')

    expect(checkbox).not.toBeChecked()
    expect(todoText.parentElement).not.toHaveClass('completed')

    fireEvent.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(todoText.parentElement).toHaveClass('completed')
  })

  test('filters todos', () => {
    const { getByText, queryByText } = render(() => <TodoApp />)

    // Add completed and active todos
    // ...

    fireEvent.click(getByText(/Active/))
    expect(queryByText('Completed todo')).not.toBeInTheDocument()

    fireEvent.click(getByText(/Completed/))
    expect(queryByText('Active todo')).not.toBeInTheDocument()
  })

  test('persists to localStorage', () => {
    const { getByPlaceholderText, getByRole } = render(() => <TodoApp />)

    fireEvent.input(getByPlaceholderText('What needs to be done?'), {
      target: { value: 'Persistent todo' }
    })
    fireEvent.click(getByRole('button', { name: 'Add' }))

    const saved = localStorage.getItem('todos')
    expect(saved).toBeTruthy()

    const todos = JSON.parse(saved!)
    expect(todos).toHaveLength(1)
    expect(todos[0].text).toBe('Persistent todo')
  })
})
```

## Key Concepts

- **CRUD Operations**: Create, read, update, delete todos
- **Filtering**: Show all, active, or completed todos
- **Local Storage**: Persist data across sessions
- **Computed Values**: Derive filtered lists and counts
- **Array Operations**: Immutable updates with `map()` and `filter()`
- **Double-click to Edit**: User-friendly editing interface

## Try It Yourself

1. Add drag-and-drop reordering
2. Implement search functionality
3. Add tags or labels
4. Create a dark mode toggle
5. Add undo/redo functionality
6. Implement data export/import

## Next Steps

- Learn about [Arrays & Objects](/guide/signals#arrays-and-objects)
- Explore [Forms](/guide/forms) for validation
- Build a [Chat App](/examples/chat)
- Read [LocalStorage Best Practices](/guide/effects#localstorage)
