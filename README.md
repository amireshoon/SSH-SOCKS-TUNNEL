# SSH-SOCKS5-TUNNEL
This small script can run your socks5 proxy through your SSH server.

## Usage
You can give server credentials in the script file or in CLI.
```bash
node ssh-socks-tunnel.js
```
To run the script.
```bash
node ssh-socks-tunnel.js -p <port> -host <server_ip> -hp <server_port> -l <server_user> -c <control_socket_path>
```