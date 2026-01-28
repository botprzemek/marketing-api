use std::{
    io::prelude::*,
    net::{TcpListener, TcpStream},
    thread,
};

fn main() {
    let listener = TcpListener::bind("0.0.0.0:3000").unwrap();

    println!("Listening on http://0.0.0.0:3000");

    for stream in listener.incoming() {
        let stream = stream.unwrap();

        thread::spawn(|| {
            handle_connection(stream);
        });
    }
}

fn handle_connection(mut stream: TcpStream) {
    let status_line = "HTTP/1.1 200 OK";

    let contents = "[{\"id\":1,\"email\":\"john.doe@acme.com\",\"first_name\":\"John\",\"last_name\":\"Doe\"}]";
    let length = contents.len();

    let response =
        format!("{status_line}\r\nContent-Type: application/json\r\nContent-Length: {length}\r\n\r\n{contents}");

    stream.write_all(response.as_bytes()).unwrap();
}