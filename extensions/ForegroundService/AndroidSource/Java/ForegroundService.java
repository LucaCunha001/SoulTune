package ${YYAndroidPackageName};

import android.app.Service;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.annotation.Nullable;

public class ForegroundService extends Service {

	private static final String CHANNEL_ID = "Foreground_SoulTune_Channel";
	private static boolean isRunning = false;

	@Override
	public void onCreate() {
		super.onCreate();
		if (isRunning) {
			android.util.Log.d("ForegroundService", "Service is already running, aborting creation.");
			return;
		}
		isRunning = true;
		createNotificationChannel();
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		if (isRunning && intent == null) {
			android.util.Log.d("ForegroundService", "Service is already running, ignoring start command.");
			return START_STICKY;
		}

		String title = "SoulTune";
		if (intent != null && intent.hasExtra("service_title")) {
			title = intent.getStringExtra("service_title");
		}

		Notification notification = new Notification.Builder(this, CHANNEL_ID)
				.setContentTitle(title)
				.setContentText("Running in the background")
				.setSmallIcon(android.R.drawable.ic_dialog_info)
				.build();

		startForeground(666, notification);

		new Thread(() -> {
			while (true) {
				android.util.Log.d("ForegroundService", "Service is running in the background");
				try { Thread.sleep(2000); } catch (InterruptedException e) { e.printStackTrace(); }
			}
		}).start();

		return START_STICKY;
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
		isRunning = false;
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
					NotificationManager.IMPORTANCE_DEFAULT
			);
			NotificationManager manager = getSystemService(NotificationManager.class);
			if (manager != null) manager.createNotificationChannel(channel);
		}
	}

	// Atualizar o nome/título da notificação
	public double updateServiceName(String newName) {
		Notification notification = new Notification.Builder(this, CHANNEL_ID)
				.setContentTitle(newName)
				.setContentText("Running in the background")
				.setSmallIcon(android.R.drawable.ic_dialog_info)
				.build();

		startForeground(666, notification);
		android.util.Log.d("ForegroundService", "Service name updated to: " + newName);

		return 1;
	}

	// --- FUNÇÃO PARA O GAMEMAKER CHAMAR ---
	public static void startServiceFromGameMaker(android.app.Activity activity, String title) {
		if (!isRunning) {
			Intent intent = new Intent(activity, ForegroundService.class);
			intent.putExtra("service_title", title);
			activity.startService(intent);
		} else {
			android.util.Log.d("ForegroundService", "Service already running, ignoring start request.");
		}
	}
}