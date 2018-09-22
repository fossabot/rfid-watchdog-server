package indi.kennhuang.rfidwatchdog.server.devices;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class DeviceServer  implements Runnable {
    public final static int serverPort = 6083;

    private static ServerSocket server = null;
    private static boolean shutdown = false;

    @Override
    public void run() {
        ExecutorService threadExecutor = Executors.newCachedThreadPool();
        try {
            System.out.println("device Server Starting on Port "+serverPort);
            server = new ServerSocket(serverPort);
            while (!shutdown) {
                Socket socket = server.accept();
                threadExecutor.execute(new DeviceHandler(socket));
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (threadExecutor != null)
                threadExecutor.shutdown();
            if (server != null)
                try {
                    server.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
    }
}
