# Build and release

## Toolchain

| Component | Version |
| --- | --- |
| Gradle (wrapper) | 8.7 |
| Android Gradle Plugin | 8.5.2 |
| compileSdk / targetSdk | 34 |
| minSdk | 24 (Android 7.0) |
| Java source and target compatibility | 1.8 |
| JDK to run Gradle | 17 or newer |

The Android SDK location is read from `local.properties` (`sdk.dir=...`), which Android Studio creates, or from the `ANDROID_HOME` environment variable. `local.properties` is not committed.

## Building

```bash
./gradlew assembleDebug       # app/build/outputs/apk/debug/app-debug.apk
./gradlew assembleRelease     # app/build/outputs/apk/release/
./gradlew clean
```

Without signing configuration, `assembleRelease` produces `app-release-unsigned.apk`, which cannot be installed. With signing configured it produces `app-release.apk`.

In Android Studio use Build, then Build APK(s), or Generate Signed App Bundle / APK.

## Signing

Release signing is optional and read from `keystore.properties` in the project root. The file and the keystore are listed in `.gitignore` and must never be committed.

1. Create a keystore (once):

```bash
keytool -genkeypair -keystore lift-release.jks -alias lift \
        -keyalg RSA -keysize 2048 -validity 10000
```

2. Copy `keystore.properties.example` to `keystore.properties` and fill it in:

```properties
storeFile=lift-release.jks
storePassword=...
keyAlias=lift
keyPassword=...
```

3. Place `lift-release.jks` in the project root and run `./gradlew assembleRelease`.

Keep a private backup of the keystore. An installed app can only be updated by an APK signed with the same key and a higher `versionCode`. If the key is lost, users must uninstall and reinstall, which deletes their data unless they made a text backup.

## Versioning

Lift uses semantic versioning (`MAJOR.MINOR.PATCH`).

| Location | Field |
| --- | --- |
| `app/build.gradle` | `versionName` (string) and `versionCode` (integer) |
| `app/src/main/assets/js/core/util.js` | `APPV`, shown on the About screen |
| `docs/version.md` | History entry |
| Badge in `README.md` | Version badge |

`versionName` and `APPV` must match. `versionCode` must increase with every APK that is distributed.

## Release procedure

1. Make sure the working tree is clean and the manual checklist in [development.md](development.md#manual-test-checklist) passes.
2. Update `versionName`, `versionCode`, `APPV` and the README badge.
3. Add the entry to [version.md](version.md): move items from Unreleased under the new version heading with the date, then commit hashes after tagging.
4. Run Prettier and commit: `git commit -am "Release 1.x.y"`.
5. Tag: `git tag -a v1.x.y -m "Lift 1.x.y"` and push the tag.
6. Build `assembleRelease` with the signing key and install the APK on a device to confirm it updates the previous version in place.

## Installing an APK on a device

1. Copy the APK to the device.
2. Open it from a file manager and allow installation from that source when prompted.
3. If Play Protect warns about an unrecognised app, choose to install anyway. The warning appears because the app is not distributed through Google Play.

Distribution through Google Play additionally requires a Play Console account and an Android App Bundle (`bundleRelease`).

## Size

| Item | Approximate size |
| --- | --- |
| `assets/` uncompressed | 8.3 MB (photos 5.4 MB, instructions 0.5 MB) |
| Release APK | 5.8 MB |
