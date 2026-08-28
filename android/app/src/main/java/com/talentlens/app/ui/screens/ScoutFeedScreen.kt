package com.talentlens.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talentlens.app.model.*
import com.talentlens.app.ui.theme.*

@Composable
fun ScoutFeedScreen() {
    var searchQuery by remember { mutableStateOf("") }
    var selectedExerciseFilter by remember { mutableStateOf<ExerciseType?>(null) }
    var onlyShortlisted by remember { mutableStateOf(false) }

    val sampleAssessments = remember {
        mutableStateListOf(
            AssessmentResult(
                id = "ass_1",
                athleteId = "ath_101",
                athleteName = "Vikas Kumar Phogat",
                age = 17,
                gender = Gender.MALE,
                state = "Haryana",
                district = "Bhiwani",
                sport = SportType.WRESTLING,
                exerciseType = ExerciseType.PUSHUPS,
                score = 62,
                durationSeconds = 60,
                percentile = 98.2f,
                talentTier = TalentTier.NATIONAL_ELITE,
                biomechanics = BiomechanicsData(formScore = 96),
                verificationHash = "TL-98-HAR-V1K4S",
                isShortlisted = true
            ),
            AssessmentResult(
                id = "ass_2",
                athleteId = "ath_102",
                athleteName = "Ananya S. Nair",
                age = 16,
                gender = Gender.FEMALE,
                state = "Kerala",
                district = "Kottayam",
                sport = SportType.ATHLETICS,
                exerciseType = ExerciseType.VERTICAL_JUMP,
                score = 62,
                durationSeconds = 30,
                percentile = 96.8f,
                talentTier = TalentTier.NATIONAL_ELITE,
                biomechanics = BiomechanicsData(formScore = 98),
                verificationHash = "TL-96-KER-AN4NY",
                isShortlisted = false
            ),
            AssessmentResult(
                id = "ass_3",
                athleteId = "ath_103",
                athleteName = "Gurpreet Singh",
                age = 19,
                gender = Gender.MALE,
                state = "Punjab",
                district = "Patiala",
                sport = SportType.WEIGHTLIFTING,
                exerciseType = ExerciseType.SQUATS,
                score = 82,
                durationSeconds = 60,
                percentile = 92.5f,
                talentTier = TalentTier.STATE_CONTENDER,
                biomechanics = BiomechanicsData(formScore = 92),
                verificationHash = "TL-92-PUN-GURP7",
                isShortlisted = false
            ),
            AssessmentResult(
                id = "ass_4",
                athleteId = "ath_104",
                athleteName = "Mary Lalremruati",
                age = 15,
                gender = Gender.FEMALE,
                state = "Manipur",
                district = "Imphal East",
                sport = SportType.BOXING,
                exerciseType = ExerciseType.PLANK,
                score = 185,
                durationSeconds = 185,
                percentile = 94.0f,
                talentTier = TalentTier.STATE_CONTENDER,
                biomechanics = BiomechanicsData(formScore = 95),
                verificationHash = "TL-94-MAN-MARY9",
                isShortlisted = true
            )
        )
    }

    val filteredList = sampleAssessments.filter {
        val matchesQuery = it.athleteName.contains(searchQuery, ignoreCase = true) || it.state.contains(searchQuery, ignoreCase = true)
        val matchesEx = selectedExerciseFilter == null || it.exerciseType == selectedExerciseFilter
        val matchesShortlist = !onlyShortlisted || it.isShortlisted
        matchesQuery && matchesEx && matchesShortlist
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Box(modifier = Modifier.size(8.dp).background(VerifiedEmerald, CircleShape))
                    Text("LIVE SCOUT NETWORK", color = VerifiedEmerald, fontSize = 11.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                }
                Text("Grassroots Discovery Feed", color = TextPrimary, fontSize = 22.sp, fontWeight = FontWeight.Black)
            }

            IconButton(onClick = { onlyShortlisted = !onlyShortlisted }) {
                Icon(
                    if (onlyShortlisted) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                    contentDescription = "Shortlist Filter",
                    tint = if (onlyShortlisted) EliteGold else TextSecondary
                )
            }
        }

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search athlete, state, or district...", color = TextSecondary, fontSize = 13.sp) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = TextSecondary) },
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = CardBackground,
                unfocusedContainerColor = CardBackground,
                focusedBorderColor = BrandOrange,
                unfocusedBorderColor = CardBorder,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            ),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        )

        // Athletes List
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(filteredList) { item ->
                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBackground),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, CardBorder, RoundedCornerShape(20.dp))
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(item.athleteName, color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                                Text("${item.district}, ${item.state} • ${item.age}y • ${item.sport.displayName}", color = TextSecondary, fontSize = 11.sp)
                            }
                            IconButton(onClick = {
                                val idx = sampleAssessments.indexOfFirst { it.id == item.id }
                                if (idx >= 0) {
                                    sampleAssessments[idx] = item.copy(isShortlisted = !item.isShortlisted)
                                }
                            }) {
                                Icon(
                                    if (item.isShortlisted) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                                    contentDescription = "Bookmark",
                                    tint = if (item.isShortlisted) EliteGold else TextSecondary
                                )
                            }
                        }

                        Divider(color = CardBorder)

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                Column {
                                    Text(item.exerciseType.shortName.uppercase(), color = TextSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    Text("${item.score} ${item.exerciseType.metricUnit}", color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Black)
                                }
                                Column {
                                    Text("PERCENTILE", color = BrandOrange, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    Text("${item.percentile.toInt()}%", color = BrandOrange, fontSize = 16.sp, fontWeight = FontWeight.Black)
                                }
                                Column {
                                    Text("FORM", color = VerifiedEmerald, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    Text("${item.biomechanics.formScore}%", color = VerifiedEmerald, fontSize = 16.sp, fontWeight = FontWeight.Black)
                                }
                            }

                            Surface(
                                color = Color(item.talentTier.badgeColorHex).copy(alpha = 0.15f),
                                shape = RoundedCornerShape(8.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(item.talentTier.badgeColorHex).copy(alpha = 0.4f))
                            ) {
                                Text(
                                    text = item.talentTier.displayName.split(" (")[0],
                                    color = Color(item.talentTier.badgeColorHex),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
