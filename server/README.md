# request-response lifecycle

**OUTLINE**

1. DNS Resolution Time
2. TCP Connection Time
3. TLS Handshake Time (HTTPS)
4. Request Sending Time
5. Server Processing Time
6. Response Construction
7. Response Sending Time
8. Client-Side Processing Time
9. Rendering Time
10. Connection Termination

**CATEGORIES**

**Client to Server**

- Main factors

  - Size of request - amount of data sent from client to server -> can edit programmatically
  - Client's network speed - download upload speed available to client -> can't edit
  - Server's network capacity - server's ability to handle network traffic, including internet connection speed & # of simultaneous connections it can manage -> could edit by simulating traffic
  - Network latency - delay between sending a request and receiving a response, determined by physical distance, network speed, and # of network hops -> could edit region of server

- DNS Resolution Time (measurable)
  - Time required to obtain IP address from a domain name
  - Process:
    - Initiate query for IP address -> contacts DNS resolver -> check cache -> recursive query -> gets response & caches IP address
  - Toggles:
    - Use different DNS servers/resolvers in backend -> can't change literal DNS time on render, but can test the hypothetical
    - Cache can only be controlled via devtools
- **HTTP protocol version impacts TCP, TLS, & Request Sending Time**
  - HTTP 1 - each response/request is over a separate TCP connection
  - HTTP 2 - includes persistent connections & reduces overhead of establishing new connections
  - HTTP 3 - uses UDP instead of TCP, combines TCP & TLS in one step
  - Toggles:
    - Cannot change programmatically -> server configuration
- TCP Connection Time (measurable)

  - Time to establish a TCP connection (a reliable, ordered, and error-checked delivery of data between two endpoints) - a three way handshake
  - Process:
    - SYN Packet (client sends ISN to server for packet order) -> SYN-ACK (server acknowledges client's SYN w/ ACK & includes its own SYN) -> ACK (client sends ACK packet to server to acknowledge SYN-ACK receipt)

- TLS Handshake Time (if applicable, AKA SSL successor) (measurable)
  - Time for client and server to create a secure communication channel, establishing encryption protocols, authentication, and key exchange
  - Process:
    - Client sends 'Client Hello' to server -> Server responds with 'Server Hello' and provides digital certificate -> Client sends a 'Finished' message encrypted using session key -> Server sends a 'Finished' message with same encryption
  - Toggle:
    - Can change TLS version, add client certificate validation, and select cipher suites
- Request Sending Time (measurable)
  - Time it actually takes to send HTTP request data over established TCP/TLS connection
  - Process:
    - Client constructs headers & prepares body -> request packaged, sent in packets, and flowed through TCP -> server receives packets, reassembles, and sends ACKs -> final packet is sent & TCP remains open for server response
  - Toggle:
    - see main factors above

**Server**

- Request parsing (measurable)
  - Time taken by the server to read incoming client req and read it
- Routing Time (measurable)
  - Time taken by the server to determine which route handle should process request
- Middleware Processing Time (measurable)
  - Middleware functions that process request (e.g. authentication, validation, logging)
- Business Logic Execution Time (measurable)
  - Time taken to execute core business logic, such as processing data, performing calculations, and other operations
- Database Query Time (measurable)
  - Time involved in fetching, inserting, updating, or deleting data in a database
- External API Call Time (optional) (measurable)
  - Time involved in making a request to an external API
- Response Construction Time (measurable)
  - Time taken to construct the HTTP response

**Server to Client**

- Response Receiving Time

**Client**

- Response Parsing Time (measurable)
- Scripting Time (measurable) -> data manipulation
    - Time taken executing JavaScript on client-side, affects how quickly scripts can run and respond 
- Rendering Time (measurable) -> dom manipulation
    - Time spent recalculating styles and layout, affecting how quickly the browser can determine where elements are placed
- Painting Time (measurable, first paint/first contentful paint/largest contentful paint)
    - Time spent drawing pixels on the screen, affecting how quickly visual updates appear to user
