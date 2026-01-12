import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Construction } from "lucide-react";

type Priority = 'Urgente' | 'Moyenne' | 'Basse';
type Todo ={
  id: number;
  text: string;
  priority : Priority
}

function App() {

  const [input, setInput] = useState<string>('')
  const [priority, setPriority] = useState<Priority>('Moyenne')

  const savedTodos = localStorage.getItem('todos')
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : []
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [filter, setfilter] = useState<Priority | "Tous">("Tous")

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function addTodo(){
    if(input.trim() === '') {
      return
    }
    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority
    }
    const newTodos = [ newTodo, ...todos]
    setTodos(newTodos)
    setInput('')
    setPriority('Moyenne')
    console.log(newTodos)
  }

  let filteredTodos: Todo[] = []

  if(filter === "Tous"){
    filteredTodos = todos
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter)
  }
   const UrgenteCount = todos.filter((t) => t.priority === 'Urgente').length
   const mediumCount = todos.filter((t) => t.priority === 'Moyenne').length
   const lowCount = todos.filter((t) => t.priority === 'Basse').length
   const totalCount = todos.length

   function deleteTodo(id: number){
    const newTodos = todos.filter((todo) => todo.id !== id)
    setTodos(newTodos)
   }

   const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set())

   function toggleTodoSelection(id: number){
    const newSelected = new Set(selectedTodos)
    if(newSelected.has(id)){
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTodos(newSelected)
   }
    function finishSelected(){
    const newTodos = todos.filter((todo) => {
      if(selectedTodos.has(todo.id)) {
        return false 
      }
    })
    setTodos(newTodos)
    setSelectedTodos(new Set())
  }

    return (
    <div className="flex justify-center">
    <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">

    <div className="flex gap-4">
      <input type="text" 
      className="input  w-full " 
      placeholder="Ajouter une tache..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      />

      <select className="select select w-full" 
       value={priority} 
       onChange={(e) => setPriority(e.target.value as Priority)}>

        <option value="Urgente">Urgente</option>
        <option value="Moyenne">Moyenne</option>
        <option value="Basse">Basse</option>

      </select>

      <button className="btn btn-primary" onClick={addTodo}>
        Ajouter</button>
    </div>

      <div className="space-y-2 flex-1 h-fit">
      <div className="flex items-center jusstify-between">
                <div className="flex flex-wrap gap-4">
          <button
            className={'btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}'}
            onClick={() => setfilter("Tous")}
          >
            Tous ({totalCount})
          </button>
           <button
            className={'btn btn-soft ${filter === "Urgente" ? "btn-primary" : ""}'}
            onClick={() => setfilter("Urgente")}
          >
            Urgente ({UrgenteCount})
          </button>
          <button
            className={'btn btn-soft ${filter === "Moyenne" ? "btn-primary" : ""}'}
            onClick={() => setfilter("Moyenne")}
          >
            Moyenne ({mediumCount})
          </button>
          <button
            className={'btn btn-soft ${filter === "Basse" ? "btn-primary" : ""}'}
            onClick={() => setfilter("Basse")}
          >
            Basse ({lowCount})

          </button>
        </div>
        <button 
        className="btn btn-primary"
        onClick={finishSelected}
        disabled={selectedTodos.size === 0}
        >Finir la selection {(selectedTodos.size)}
        </button>

      </div>


        {filteredTodos.length >0 ? (
          <ul className="divide-y divide-primary/20">
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                <TodoItem todo={todo}
                isSelected={selectedTodos.has(todo.id)}
                 onDelete={() => deleteTodo(todo.id)}
                 onToggleSelect={toggleTodoSelection}
                  />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center flex-col p-5">
            <div>
              <Construction strokeWidth={1} className="w-40 h-40 text-primary" />
            </div>
            <p className="text-sm text-lg mt-4">
              Aucune tâche à afficher
            </p>
          </div>
      )}
      </div>
    </div>
   </div>
  )
}

export default App
