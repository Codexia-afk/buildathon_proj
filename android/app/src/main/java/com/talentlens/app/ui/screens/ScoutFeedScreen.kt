package com.talentlens.app.ui.screens

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talentlens.app.data.AthleteRepository
import com.talentlens.app.model.*
import com.talentlens.app.ui.components.AthleteComparisonModal
import com.talentlens.app.ui.components.AthleteDetailModal
import com.talentlens.app.ui.theme.*

@Composable
fun ScoutFeedScreen() {
    val context = LocalContext.current
    val assessments by AthleteRepository.assessments.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedExerciseFilter by remember { mutableStateOf<ExerciseType?>(null) }
    var onlyShortlisted by remember { mutableStateOf(false) }

    var selectedForDetail by remember { mutableStateOf<AssessmentResult?>(null) }
    var selectedForCompare by remember { mutableStateOf(setOf<String>()) }
    var showComparisonDialog by remember { mutableStateOf(false) }

    val filteredList = assessments.filter {
        val matchesQuery = it.athleteName.contains(searchQuery, ignoreCase = true) || it.state.contains(searchQuery, ignoreCase = true) || it.district.contains(searchQuery, ignoreCase = true)
        val matchesEx = selectedExerciseFilter == null || it.exerciseType == selectedExerciseFilter
        val matchesShortlist = !onlyShortlisted || it.isShortlisted
        matchesQuery && matchesEx && matchesShortlist
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Header Row
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
                Text("Discovery Command Feed", color = TextPrimary, fontSize = 22.sp, fontWeight = FontWeight.Black)
            }

            // Quick Actions: Simulate Live & Export CSV
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                IconButton(
                    onClick = {
                        val csv = AthleteRepository.exportToCsvString()
                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, csv)
                        }
                        context.startActivity(Intent.createChooser(shareIntent, "Export Scouting Database"))
                    },
                    modifier = Modifier.background(CardBackground, CircleShape)
                ) {
                    Icon(Icons.Default.Download, contentDescription = "Export CSV", tint = TextPrimary)
                }

                IconButton(
                    onClick = { AthleteRepository.simulateIncomingLiveAssessment() },
                    modifier = Modifier.background(CardBackground, CircleShape)
                ) {
                    Icon(Icons.Default.AutoAwesome, contentDescription = "Simulate Submission", tint = BrandOrange)
                }
            }
        }

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search athlete name, state, or district...", color = TextSecondary, fontSize = 13.sp) },
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

        // Exercise Filter Chips
        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            item {
                Surface(
                    color = if (selectedExerciseFilter == null) BrandOrange else CardBackground,
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, if (selectedExerciseFilter == null) BrandOrange else CardBorder),
                    modifier = Modifier.clickable { selectedExerciseFilter = null }
                ) {
                    Text("All Tests", color = if (selectedExerciseFilter == null) TextPrimary else TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp))
                }
            }
            items(ExerciseType.values()) { ex ->
                val isSelected = selectedExerciseFilter == ex
                Surface(
                    color = if (isSelected) BrandOrange else CardBackground,
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) BrandOrange else CardBorder),
                    modifier = Modifier.clickable { selectedExerciseFilter = ex }
                ) {
                    Text(ex.shortName, color = if (isSelected) TextPrimary else TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp))
                }
            }
        }

        // Comparison Bar Trigger (when 2+ selected)
        if (selectedForCompare.size >= 2) {
            Surface(
                color = CyberCyan.copy(alpha = 0.15f),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CyberCyan.copy(alpha = 0.5f)),
                modifier = Modifier.fillMaxWidth().clickable { showComparisonDialog = true }
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.CompareArrows, contentDescription = null, tint = CyberCyan)
                        Text("${selectedForCompare.size} Athletes Selected for Comparison", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                    Text("View Matrix →", color = CyberCyan, fontSize = 12.sp, fontWeight = FontWeight.Black)
                }
            }
        }

        // Athletes List
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(filteredList) { item ->
                val isCompared = selectedForCompare.contains(item.id)

                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = if (isCompared) CardBackground.copy(alpha = 0.9f) else CardBackground),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, if (isCompared) CyberCyan else CardBorder, RoundedCornerShape(20.dp))
                        .clickable { selectedForDetail = item }
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                // Compare Checkbox
                                Checkbox(
                                    checked = isCompared,
                                    onCheckedChange = {
                                        selectedForCompare = if (isCompared) {
                                            selectedForCompare - item.id
                                        } else {
                                            if (selectedForCompare.size >= 3) selectedForCompare else selectedForCompare + item.id
                                        }
                                    },
                                    colors = CheckboxDefaults.colors(checkedColor = CyberCyan)
                                )

                                Column {
                                    Text(item.athleteName, color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                                    Text("${item.district}, ${item.state} • ${item.age}y • ${item.sport.displayName}", color = TextSecondary, fontSize = 11.sp)
                                }
                            }

                            IconButton(onClick = { AthleteRepository.toggleShortlist(item.id) }) {
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

    // Detail Dialog
    selectedForDetail?.let { assessment ->
        AthleteDetailModal(
            assessment = assessment,
            onDismiss = { selectedForDetail = null },
            onToggleShortlist = { AthleteRepository.toggleShortlist(assessment.id) }
        )
    }

    // Comparison Dialog
    if (showComparisonDialog) {
        val comparedItems = assessments.filter { selectedForCompare.contains(it.id) }
        AthleteComparisonModal(
            athletes = comparedItems,
            onDismiss = {
                showComparisonDialog = false
                selectedForCompare = emptySet()
            }
        )
    }
}
