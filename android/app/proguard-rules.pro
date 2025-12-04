# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep class com.sukanime.app.** { *; }

# Keep WebView JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep AndroidX classes
-keep class androidx.** { *; }
-keep interface androidx.** { *; }

# Keep window insets controller
-keep class androidx.core.view.WindowInsetsControllerCompat { *; }
-keep class androidx.core.view.WindowCompat { *; }

# Keep OnBackPressedCallback
-keep class androidx.activity.OnBackPressedCallback { *; }
-keep class androidx.activity.OnBackPressedDispatcher { *; }

# Uncomment this to preserve the line number information for
# debugging stack traces.
-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile
