## API Routes

### Partner Routes
- **GET /api/partners**  
  Retrieve a list of all delivery partners.
  
- **POST /api/partners**  
  Register a new delivery partner.

- **PUT /api/partners/[id]**  
  Update details of a specific delivery partner.

- **DELETE /api/partners/[id]**  
  Delete a specific delivery partner.

### Order Routes
- **GET /api/orders**  
  Retrieve a list of all orders.

- **POST /api/orders/assign**  
  Assign an order to a partner.

- **PUT /api/orders/[id]/status**  
  Update the status of an order (pending, assigned, picked, delivered).

### Assignment Routes
- **GET /api/assignments/metrics**  
  Retrieve assignment performance metrics.

- **POST /api/assignments/run**  
  Execute the assignment process for pending orders.


Backend:
Node.js: A JavaScript runtime used for server-side development.
Express: A web framework for Node.js used to build the API routes.
MongoDB: A NoSQL database used for storing delivery partners, orders, and assignments.

---