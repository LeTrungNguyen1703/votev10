// Used to pass initial data, optional.
import { api, StreamOut } from 'encore.dev/api';
import log from 'encore.dev/log';

interface Handshake {
  rows: number;
}
// What the server sends over the stream.
interface Message {
  row: string;
}

export const logStream = api.streamOut<Handshake, Message>(
  { path: "/logs", expose: true },
  async (handshake, stream) => {
    try {
      for await (const row of mockedLogs(handshake.rows, stream)) {
        // Send the message to the client
        await stream.send({ row });
      }
    } catch (err) {
      log.error("Upload error:", err);
    }
  },
);


// This function generates an async iterator that yields mocked log rows
async function* mockedLogs(rows: number, stream: StreamOut<Message>) {
  for (let i = 0; i < rows; i++) {
    yield new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`Log row ${i + 1}`);
      }, 500);
    });
  }

  // Close the stream when all logs have been sent
  await stream.close();
}