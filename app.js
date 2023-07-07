const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http:/localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { status, search_q = "", priority } = request;
  console.log(status, search_q, priority);

  switch (true) {
    case hasPriorityAndStatusProperties(request.query):
      getTodosQuery = `
          SELECT 
           *
        FROM 
            todo
        WHERE 
        todo LIKE '%${search_q}%' AND priority = '%${priority}%' 
        AND status = '%${status}%';`;
      break;
    case hasPriorityProperty(request.query):
      getTodosQuery = `
        SELECT *
        FROM
        todo
        WHERE
        todo LIKE '%${search_id}%'
        AND status= '${status}'
        AND priority='${priority}';`;
      break;

    case hasPriorityProperty(request.query):
      getTodosQuery = `
        SELECT *
        FROM
        todo
        WHERE
        todo LIKE '%${search_id}%'
        AND priority='${priority}';`;
      break;

    case hasPriorityProperty(request.query):
      getTodosQuery = `
        SELECT *
        FROM
        todo
        WHERE
        todo LIKE '%${search_id}%'
        AND status='${status}';`;
      break;
    default:
      getTodosQuery = `
            SELECT
            * FROM
            todo
            WHERE
            todo LIKE '%${search_q}%';`;
  }
  data = await database.all(getTodosQuery);
  response.send(data);
});

//GET Todo API-2
app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;

  const getTodosQuery = `
        SELECT 
           *
        FROM 
            todo
        WHERE 
            id = ${todoId};`;

  const todo = await db.get(getTodosQuery);
  response.send(todo);
});

//Add Todo API-4
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;

  const addTodoQuery = `
        INSERT INTO 
            todo (id, todo, priority, status)
        VALUES
            (
                ${id},
               '${todo}',
               '${priority}',
               '${status}',
            );`;

  await db.run(addTodoQuery);
  console.log(createUser);
  response.send("Todo Successfully Added");
});

//Update Todo API-5
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let updateColumn = "";
  const requestBody = request.body;

  switch (true) {
    case requestBody.status !== undefined:
      updateColumn = "Status";
      break;
    case requestBody.priority !== undefined:
      updateColumn = "Priority";
      break;

    case requestBody.todo !== undefined:
      updateColumn = "Todo";
      break;
  }

  const previousTodoQuery = `
  SELECT *
  FROM
  todo
  WHERE
  id=${todoId};
  `;
  const previousTodo = await database.get(previousTodoQuery);

  const {
    todo = previousTodo.todo,
    priority = previousTodo.priority,
    status = previousTodo.status,
  } = request.body;

  const updateTodoQuery = `
  UPDATE
  todo
  SET 
  todo='${todo}',
  priority='${priority},
  status='${status},
  WHERE
  id=${todoId};
  `;

  await db.run(updateTodoQuery);
  response.send("${updateColumn} Updated");
});

//Delete Todo API-6
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
            DELETE FROM 
                todo
            WHERE 
               id=${todoId};`;

  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
