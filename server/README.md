# response-time-visual

**Outline:**

1. DNS Resolution Time
2. TCP Connection Time
3. TLS Handshake Time
4. Request Sending Time
5. Server Processing Time
6. Network Latency
7. Response Receiving Time
8. Client-Side Processing Time
9. Rendering Time

**Categories:**

Client to Server

- Main factors

  - Size of request - amount of data sent from client to server -> can edit programmatically
  - Client's network speed - download upload speed available to client -> can't edit
  - Server's network capacity - server's ability to handle network traffic, including internet connection speed & # of simultaneous connections it can manage -> could edit by simulating traffic
  - Network latency - delay between sending a request and receiving a response, determined by physical distance, network speed, and # of network hops -> could edit region of server

- DNS Resolution Time
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
    - Cannot change programatically -> server configuration
- TCP Connection Time

  - Time to establish a TCP connection (a reliable, ordered, and error-checked delivery of data between two endpoints) - a three way handshake
  - Process:
    - SYN Packet (client sends ISN to server for packet order) -> SYN-ACK (server acknowledges client's SYN w/ ACK & includes its own SYN) -> ACK (client sends ACK packet to server to acknowledge SYN-ACK receipt)

- TLS Handshake Time (if applicable, AKA SSL successor)
  - Time for client and server to create a secure communication channel, establishing encryption protocols, authentication, and key exchange
  - Process:
    - Client sends 'Client Hello' to server -> Server responsds with 'Server Hello' and provides digital certificate -> Client sends a 'Finished' message encrypted using session key -> Server sends a 'Finished' message with same encryption
  - Toggle:
    - Can change TLS version, add client certificate validation, and select cipher suites
- Request Sending Time
  - Time it actually takes to send HTTP request data over established TCP/TLS connection
  - Process: 
    - Client constructs headers & prepares body -> request packaged, sent in packets, and flowed through TCP -> server receives packets, reassembles, and sends ACKs -> final packet is sent & TCP remains open for server response
  - Toggle:
    - see main factors above

Server

- Request parsing
- Routing and Request Handling
- Middleware execution
- Business Logic execution
- Database operations
- I/O Operations
- Response preparation
- Server resource management
- Concurrency handling

Server to Client

- Response Receiving Time

Client

- Client Side Processing Time
- Rendering Time
