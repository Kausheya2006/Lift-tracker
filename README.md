# Lift

Minimal offline workout tracker for Android: workout groups, weekly or rotating routines
(for example 4 training days + 1 rest day), set logging with PRs, and progress charts.

The app is a single web page (`app/src/main/assets/index.html`) shown full-screen inside a
small native Android WebView wrapper. No network permission, no accounts, data stays on the device.

## Project layout

```
Lift/
├─ app/
│  ├─ build.gradle
│  └─ src/main/
│     ├─ AndroidManifest.xml
│     ├─ assets/index.html          <- the whole app (HTML + CSS + JS)
│     ├─ java/com/lift/tracker/     <- MainActivity, LiftClient, BackCb
│     └─ res/                       <- launcher icons, themes, colours
├─ gradle/wrapper/                  <- Gradle wrapper (8.7)
├─ build.gradle  settings.gradle  gradle.properties
├─ keystore.properties.example      <- template for release signing
└─ .gitignore  .gitattributes  .editorconfig
```

## Open in Android Studio

1. Android Studio -> File -> Open -> choose the `Lift` folder.
2. Wait for Gradle sync (needs JDK 17+, bundled with recent Android Studio).
3. Run on a device or emulator (minSdk 24, Android 7.0+).

## Build from the command line

```bash
./gradlew assembleDebug      # app/build/outputs/apk/debug/app-debug.apk
./gradlew assembleRelease    # signed if keystore.properties exists, otherwise unsigned
```

Set `sdk.dir` in `local.properties` (Android Studio does this for you) or export `ANDROID_HOME`.

## Release signing

1. Put your keystore in the project root as `lift-release.jks`.
2. Copy `keystore.properties.example` to `keystore.properties` and fill in the passwords.
3. `./gradlew assembleRelease`

Both files are git-ignored. Keep a backup of the keystore: updates installed over an existing
app must be signed with the same key.

## Changing the app

- Edit `app/src/main/assets/index.html`. The exercise list is the `LIB` array, styles are in
  `<style>`, logic is in `<script>`. The page also runs in any browser for quick testing.
- Bump `versionCode` and `versionName` in `app/build.gradle` for each release.

## Git

```bash
git log --oneline
git switch -c feature/my-change
git add -A && git commit -m "Describe the change"
```

## Data and privacy

Everything is stored in the WebView's local storage on the device. Use Settings -> Your data
inside the app to back up or restore as text.
