package com.talentlens.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.talentlens.app.model.AssessmentResult
import com.talentlens.app.model.AthleteProfile
import com.talentlens.app.ui.screens.*
import com.talentlens.app.ui.theme.*

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Workout : Screen("workout", "Workout Lab", Icons.Default.FitnessCenter)
    object ScoutFeed : Screen("scout", "Scout Feed", Icons.Default.Group)
    object Benchmarks : Screen("benchmarks", "Standards", Icons.Default.Leaderboard)
    object Result : Screen("result", "Result", Icons.Default.Verified)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TalentLensTheme {
                MainAppScaffold()
            }
        }
    }
}

@Composable
fun MainAppScaffold() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    var currentAthlete by remember { mutableStateOf(AthleteProfile()) }
    var latestAssessment by remember { mutableStateOf<AssessmentResult?>(null) }

    val bottomNavScreens = listOf(
        Screen.Home,
        Screen.Workout,
        Screen.ScoutFeed,
        Screen.Benchmarks
    )

    Scaffold(
        bottomBar = {
            if (currentRoute != Screen.Result.route) {
                NavigationBar(
                    containerColor = CardBackground,
                    contentColor = TextPrimary,
                    tonalElevation = 8.dp
                ) {
                    bottomNavScreens.forEach { screen ->
                        val isSelected = currentRoute == screen.route
                        NavigationBarItem(
                            icon = {
                                Icon(
                                    screen.icon,
                                    contentDescription = screen.title,
                                    tint = if (isSelected) BrandOrange else TextSecondary
                                )
                            },
                            label = {
                                Text(
                                    screen.title,
                                    color = if (isSelected) BrandOrange else TextSecondary
                                )
                            },
                            selected = isSelected,
                            colors = NavigationBarItemDefaults.colors(
                                indicatorColor = BrandOrange.copy(alpha = 0.15f)
                            ),
                            onClick = {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    onStartAthleteAssessment = { navController.navigate(Screen.Workout.route) },
                    onOpenScoutDashboard = { navController.navigate(Screen.ScoutFeed.route) }
                )
            }

            composable(Screen.Workout.route) {
                WorkoutScreen(
                    athlete = currentAthlete,
                    onFinishWorkout = { result ->
                        latestAssessment = result
                        navController.navigate(Screen.Result.route)
                    }
                )
            }

            composable(Screen.Result.route) {
                latestAssessment?.let { result ->
                    ResultScreen(
                        assessment = result,
                        onRetest = { navController.navigate(Screen.Workout.route) },
                        onNavigateToScout = { navController.navigate(Screen.ScoutFeed.route) }
                    )
                } ?: run {
                    navController.navigate(Screen.Home.route)
                }
            }

            composable(Screen.ScoutFeed.route) {
                ScoutFeedScreen()
            }

            composable(Screen.Benchmarks.route) {
                BenchmarksScreen()
            }
        }
    }
}
