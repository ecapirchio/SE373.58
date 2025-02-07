const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === '/todo') {
    // The JSON file
    const filePath = path.join(__dirname, 'todo.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });
  } else if (url === '/index') {
    // The index HTML page
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>Index</title></head>
      <body>
        <h1>Emma Capirchio</h1>
        <ol>
          <li>Football</li>
          <li>Coding</li>
          <li>Playing Video Games</li>
        </ol>
        <a href="/todo">View To-Do JSON</a><br>
        <a href="/read-todo">Read To-Do</a>
      </body>
      </html>
    `);
  } else if (url === '/read-todo') {
    // The page that fetches and displays the todo JSON
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Read To-Do</title>
        <script>
          async function fetchTodo() {
            try {
              const response = await fetch('/todo');
              if (!response.ok) {
                throw new Error('Failed to fetch todo list');
              }
              const data = await response.json();
              const list = document.getElementById('todo-list');
              list.innerHTML = ''; // Clear any existing content
              data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = \`\${item.title} - \${item.completed ? 'Completed' : 'Not Completed'}\`;
                list.appendChild(li);
              });
            } catch (error) {
              console.error('Error fetching todo list:', error);
            }
          }
          window.onload = fetchTodo;
        </script>
      </head>
      <body>
        <h1>To-Do List</h1>
        <ul id="todo-list"></ul>
        <a href="/index">Back to Index</a>
      </body>
      </html>
    `);
  } else {
    // Redirect to index for invalid routes
    res.writeHead(301, { 'Location': `http://${req.headers['host']}/index` });
    res.end();
  }
});

server.listen(3001, () => {
  console.log('Server is running at http://localhost:3001');
});
