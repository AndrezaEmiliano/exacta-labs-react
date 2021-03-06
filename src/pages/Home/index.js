import { useEffect, useCallback, useState } from "react";

import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import Pagination from "../../components/Pagination";
import * as S from "./styles";
import { Tasks } from "../../services/tasks";

const limit = 5;

function Home() {
  const [totalPages, setTotalPages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);

  const refreshTasks = useCallback(async (page) => {
    const { data, total } = await Tasks.getTasks(page, limit);

    setTasks(data);
    setTotalPages(Math.ceil(total / limit));
  }, []);

  async function createTask(text) {
    await Tasks.createTask({ text });

    refreshTasks(page);
  }

  async function removeTask(task) {
    await Tasks.deleteTask(task.id);

    refreshTasks(page);
  }

  function handlePrevious() {
    if (page > 1) {
      setPage(page - 1);
    } else {
      return alert("Você já esta na primeira página");
    }
  }

  function handleNext() {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }

  useEffect(() => {
    refreshTasks(page);
  }, [refreshTasks, page]);

  return (
    <S.Wrapper>
      <TaskForm onSubmit={createTask} />

      <TaskList tasks={tasks} removeTask={removeTask} />

      <Pagination
        firstPage={page === 1}
        lastPage={page === totalPages}
        page={page}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </S.Wrapper>
  );
}

export default Home;
