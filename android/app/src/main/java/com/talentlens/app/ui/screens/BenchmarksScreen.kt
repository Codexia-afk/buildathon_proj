package com.talentlens.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talentlens.app.engine.PercentileEngine
import com.talentlens.app.model.ExerciseType
import com.talentlens.app.model.Gender
import com.talentlens.app.ui.theme.*

@Composable
fun BenchmarksScreen() {
    var selectedExercise by remember { mutableStateOf(ExerciseType.PUSHUPS) }
    var selectedGender by remember { mutableStateOf(Gender.MALE) }
    var age by remember { mutableStateOf(17f) }
    var score by remember { mutableStateOf(38f) }

    val calc = remember(selectedExercise, selectedGender, age, score) {
        PercentileEngine.calculate(
            score = score.toInt(),
            age = age.toInt(),
            gender = selectedGender,
            exerciseType = selectedExercise
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text("NATIONAL STANDARDS", color = BrandOrange, fontSize = 11.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
            Text("Percentile Calculator", color = TextPrimary, fontSize = 24.sp, fontWeight = FontWeight.Black)
            Text("Explore empirical distributions calibrated against Khelo India / SAI youth norms.", color = TextSecondary, fontSize = 12.sp)
        }

        // Exercise Tabs
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(ExerciseType.values()) { ex ->
                val isSelected = ex == selectedExercise
                Surface(
                    color = if (isSelected) CardBackground else CardBackground.copy(alpha = 0.5f),
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(
                        if (isSelected) 1.5.dp else 1.dp,
                        if (isSelected) BrandOrange else CardBorder
                    ),
                    modifier = Modifier.clickable { selectedExercise = ex }
                ) {
                    Text(
                        text = ex.shortName,
                        color = if (isSelected) TextPrimary else TextSecondary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
                    )
                }
            }
        }

        // Gender Selector
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf(Gender.MALE, Gender.FEMALE).forEach { g ->
                val isSelected = g == selectedGender
                Button(
                    onClick = { selectedGender = g },
                    colors = ButtonDefaults.buttonColors(containerColor = if (isSelected) BrandOrange else CardBackground),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f).border(1.dp, if (isSelected) BrandOrange else CardBorder, RoundedCornerShape(12.dp))
                ) {
                    Text(g.displayName, color = if (isSelected) TextPrimary else TextSecondary, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Sliders Card
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            modifier = Modifier.fillMaxWidth().border(1.dp, CardBorder, RoundedCornerShape(20.dp))
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                // Age Slider
                Column {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("ATHLETE AGE", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text("${age.toInt()} Years Old", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                    Slider(
                        value = age,
                        onValueChange = { age = it },
                        valueRange = 10f..35f,
                        colors = SliderDefaults.colors(thumbColor = BrandOrange, activeTrackColor = BrandOrange)
                    )
                }

                // Score Slider
                Column {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("TEST SCORE", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text("${score.toInt()} ${selectedExercise.metricUnit}", color = BrandOrange, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                    Slider(
                        value = score,
                        onValueChange = { score = it },
                        valueRange = 1f..(if (selectedExercise == ExerciseType.PLANK) 300f else 100f),
                        colors = SliderDefaults.colors(thumbColor = BrandOrange, activeTrackColor = BrandOrange)
                    )
                }
            }
        }

        // Dynamic Calculation Card
        Surface(
            color = Color(calc.talentTier.badgeColorHex).copy(alpha = 0.15f),
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(calc.talentTier.badgeColorHex).copy(alpha = 0.5f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("CALCULATED PLACEMENT", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    Text("${calc.percentileRounded}%", color = TextPrimary, fontSize = 42.sp, fontWeight = FontWeight.Black)
                    Text(calc.talentTier.displayName, color = Color(calc.talentTier.badgeColorHex), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
                Text(calc.comparisonSummary, color = TextSecondary, fontSize = 12.sp)
            }
        }
    }
}
