package com.talentlens.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.window.Dialog
import com.talentlens.app.data.AthleteRepository
import com.talentlens.app.model.AssessmentResult
import com.talentlens.app.ui.theme.*

@Composable
fun AthleteDetailModal(
    assessment: AssessmentResult,
    onDismiss: () -> Unit,
    onToggleShortlist: () -> Unit
) {
    var noteInput by remember { mutableStateOf("") }
    var inviteSent by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = BackgroundDark),
            modifier = Modifier
                .fillMaxWidth()
                .padding(6.dp)
                .border(1.dp, CardBorder, RoundedCornerShape(24.dp))
        ) {
            Column(
                modifier = Modifier
                    .padding(18.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(assessment.athleteName, color = TextPrimary, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        Text("${assessment.sport.displayName} • ${assessment.district}, ${assessment.state}", color = TextSecondary, fontSize = 12.sp)
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = TextSecondary)
                    }
                }

                Divider(color = CardBorder)

                // KPI 3-Grid
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Surface(
                        color = CardBackground,
                        shape = RoundedCornerShape(14.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
                        modifier = Modifier.weight(1f).padding(end = 4.dp)
                    ) {
                        Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("PERCENTILE", color = BrandOrange, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            Text("${assessment.percentile.toInt()}%", color = BrandOrange, fontSize = 20.sp, fontWeight = FontWeight.Black)
                        }
                    }

                    Surface(
                        color = CardBackground,
                        shape = RoundedCornerShape(14.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
                        modifier = Modifier.weight(1f).padding(horizontal = 2.dp)
                    ) {
                        Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("SCORE", color = TextSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            Text("${assessment.score} ${assessment.exerciseType.metricUnit}", color = TextPrimary, fontSize = 20.sp, fontWeight = FontWeight.Black)
                        }
                    }

                    Surface(
                        color = CardBackground,
                        shape = RoundedCornerShape(14.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
                        modifier = Modifier.weight(1f).padding(start = 4.dp)
                    ) {
                        Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("FORM", color = VerifiedEmerald, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            Text("${assessment.biomechanics.formScore}%", color = VerifiedEmerald, fontSize = 20.sp, fontWeight = FontWeight.Black)
                        }
                    }
                }

                // Biomechanics Breakdown
                Surface(
                    color = CardBackground,
                    shape = RoundedCornerShape(16.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("AI BIOMECHANICAL REPORT", color = CyberCyan, fontSize = 10.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Average Joint Flexion:", color = TextSecondary, fontSize = 12.sp)
                            Text("${assessment.biomechanics.averageElbowFlexion.toInt()}° (Target 90°)", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Spine Alignment:", color = TextSecondary, fontSize = 12.sp)
                            Text("${assessment.biomechanics.averageTrunkAlignment.toInt()}° (Neutral)", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Cadence / Velocity:", color = TextSecondary, fontSize = 12.sp)
                            Text("${assessment.biomechanics.cadenceRpm.toInt()} RPM", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                // Actions: Shortlist & Invite
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = onToggleShortlist,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (assessment.isShortlisted) EliteGold.copy(alpha = 0.2f) else CardBackground
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f).border(1.dp, if (assessment.isShortlisted) EliteGold else CardBorder, RoundedCornerShape(12.dp))
                    ) {
                        Icon(
                            if (assessment.isShortlisted) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                            contentDescription = null,
                            tint = if (assessment.isShortlisted) EliteGold else TextSecondary,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(Modifier.width(6.dp))
                        Text(if (assessment.isShortlisted) "Shortlisted" else "Bookmark", color = if (assessment.isShortlisted) EliteGold else TextSecondary, fontSize = 12.sp)
                    }

                    Button(
                        onClick = { inviteSent = true },
                        enabled = !inviteSent,
                        colors = ButtonDefaults.buttonColors(containerColor = BrandOrange),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1.3f)
                    ) {
                        Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text(if (inviteSent) "Invite Sent ✓" else "Invite for Trials", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Scout Notes Section
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Scout Evaluation Notes", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Bold)

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        OutlinedTextField(
                            value = noteInput,
                            onValueChange = { noteInput = it },
                            placeholder = { Text("Add scout observation...", color = TextSecondary, fontSize = 11.sp) },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = CardBackground,
                                unfocusedContainerColor = CardBackground,
                                focusedBorderColor = BrandOrange,
                                unfocusedBorderColor = CardBorder,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            ),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f)
                        )

                        Button(
                            onClick = {
                                if (noteInput.isNotBlank()) {
                                    AthleteRepository.addScoutNote(assessment.id, noteInput.trim())
                                    noteInput = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = CardBackground),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                        ) {
                            Text("Add", color = TextPrimary, fontSize = 12.sp)
                        }
                    }

                    assessment.scoutNotes.forEach { note ->
                        Surface(
                            color = CardBackground.copy(alpha = 0.6f),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("• $note", color = TextSecondary, fontSize = 11.sp, modifier = Modifier.padding(10.dp))
                        }
                    }
                }
            }
        }
    }
}
