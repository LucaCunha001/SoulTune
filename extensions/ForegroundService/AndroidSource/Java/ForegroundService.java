package ${YYAndroidPackageName};

import android.app.Service;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

public class ForegroundService extends Service {

    private static final String CHANNEL_ID = "Foreground_SoulTune_Channel";
    private static final int NOTIFICATION_ID = 666;

    private static boolean isRunning = false;
    private volatile boolean isServiceActive = false;
    private Thread workerThread;
    private String currentTitle = "SoulTune";

    @Override
    public void onCreate() {
        super.onCreate();
        if (isRunning) {
            android.util.Log.d("ForegroundService", "Service is already running, aborting creation.");
            stopSelf();
            return;
        }
        isRunning = true;
        isServiceActive = true;
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && intent.hasExtra("service_title")) {
            currentTitle = intent.getStringExtra("service_title");
        }

        Notification notification = buildNotification(currentTitle);
        startForeground(NOTIFICATION_ID, notification);

        if (workerThread == null || !workerThread.isAlive()) {
            workerThread = new Thread(() -> {
                while (isServiceActive) {
                    android.util.Log.d("ForegroundService", "Service is running in the background");
                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
                android.util.Log.d("ForegroundService", "Background thread stopped.");
            });
            workerThread.start();
        }

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        isServiceActive = false;
        isRunning = false;
        if (workerThread != null) {
            workerThread.interrupt();
            workerThread = null;
        }
        android.util.Log.d("ForegroundService", "Service destroyed.");
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    public static boolean foregroundServiceRunning() {
        return isRunning;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "SoulTune Foreground Service",
                    NotificationManager.IMPORTANCE_LOW // não incomoda o usuário
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    private Notification buildNotification(String title) {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(title)
                .setContentText("Running in the background")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .build();
    }

    public double updateServiceName(String newName) {
        currentTitle = newName;
        Notification notification = buildNotification(newName);
        startForeground(NOTIFICATION_ID, notification);
        android.util.Log.d("ForegroundService", "Service name updated to: " + newName);
        return 1;
    }

    // --- Métodos públicos para GameMaker ---

    public static void startServiceFromGameMaker(android.app.Activity activity, String title) {
        if (!isRunning) {
            Intent intent = new Intent(activity, ForegroundService.class);
            intent.putExtra("service_title", title);

            // A partir do Android 8 precisa do startForegroundService
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                ContextCompat.startForegroundService(activity, intent);
            } else {
                activity.startService(intent);
            }
        } else {
            android.util.Log.d("ForegroundService", "Service already running, ignoring start request.");
        }
    }

    public static void stopServiceFromGameMaker(android.app.Activity activity) {
        if (isRunning) {
            Intent intent = new Intent(activity, ForegroundService.class);
            activity.stopService(intent);
        }
    }
}