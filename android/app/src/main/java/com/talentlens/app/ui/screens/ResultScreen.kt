package com.talentlens.app.ui.screens

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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talentlens.app.model.AssessmentResult
import com.talentlens.app.ui.components.CertificateDialog
import com.talentlens.app.ui.theme.*

@Composable
fun ResultScreen(
    assessment: AssessmentResult,
    onRetest: () -> Unit,
    onNavigateToScout: () -> Unit
) {
    var showCertificate by remember { mutableStateOf(false) }
    var isBroadcasted by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Banner
        Surface(
            color = VerifiedEmerald.copy(alpha = 0.15f),
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, VerifiedEmerald.copy(alpha = 0.4f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = VerifiedEmerald, modifier = Modifier.size(28.dp))
                Column {
                    Text("AI VERIFIED ASSESSMENT", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                    Text("Hash: ${assessment.verificationHash}", color = VerifiedEmerald, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                }
            }
        }

        // Main Result Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, CardBorder, RoundedCornerShape(24.dp))
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                
                // Athlete details
                Text(assessment.exerciseType.title.uppercase(), color = BrandOrange, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Text(assessment.athleteName, color = TextPrimary, fontSize = 24.sp, fontWeight = FontWeight.Black)
                Text("${assessment.district}, ${assessment.state} • ${assessment.age}y • ${assessment.sport.displayName}", color = TextSecondary, fontSize = 12.sp)

                Divider(color = CardBorder)

                // 3-Metric KPI Grid
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("SCORE", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("${assessment.score}", color = TextPrimary, fontSize = 32.sp, fontWeight = FontWeight.Black)
                        Text(assessment.exerciseType.metricUnit.uppercase(), color = BrandOrange, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("NATIONAL %ILE", color = BrandOrange, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("${assessment.percentile.toInt()}%", color = BrandOrange, fontSize = 32.sp, fontWeight = FontWeight.Black)
                        Text("SAI Standards", color = TextSecondary, fontSize = 10.sp)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("FORM SCORE", color = VerifiedEmerald, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("${assessment.biomechanics.formScore}%", color = VerifiedEmerald, fontSize = 32.sp, fontWeight = FontWeight.Black)
                        Text("Precision", color = TextSecondary, fontSize = 10.sp)
                    }
                }

                // Talent Tier Badge
                Surface(
                    color = Color(assessment.talentTier.badgeColorHex).copy(alpha = 0.15f),
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(assessment.talentTier.badgeColorHex).copy(alpha = 0.4f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = assessment.talentTier.displayName,
                        color = Color(assessment.talentTier.badgeColorHex),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(vertical = 8.dp)
                    )
                }
            }
        }

        // Action Buttons
        Button(
            onClick = { showCertificate = true },
            colors = ButtonDefaults.buttonColors(containerColor = CardBackground),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth().height(52.dp).border(1.dp, CardBorder, RoundedCornerShape(16.dp))
        ) {
            Icon(Icons.Default.WorkspacePremium, contentDescription = null, tint = BrandOrange)
            Spacer(Modifier.width(8.dp))
            Text("View & Print Official Certificate", color = TextPrimary, fontWeight = FontWeight.Bold)
        }

        Button(
            onClick = { isBroadcasted = true },
            enabled = !isBroadcasted,
            colors = ButtonDefaults.buttonColors(containerColor = BrandOrange),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth().height(52.dp)
        ) {
            Icon(Icons.Default.Send, contentDescription = null)
            Spacer(Modifier.width(8.dp))
            Text(if (isBroadcasted) "Broadcasted to Live Scouts ✓" else "Push to Live Scout Network", fontWeight = FontWeight.Bold)
        }

        OutlinedButton(
            onClick = onRetest,
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth().height(52.dp)
        ) {
            Icon(Icons.Default.Refresh, contentDescription = null, tint = TextSecondary)
            Spacer(Modifier.width(8.dp))
            Text("Retest / Switch Exercise", color = TextSecondary)
        }
    }

    if (showCertificate) {
        CertificateDialog(
            assessment = assessment,
            onDismiss = { showCertificate = false }
        )
    }
}
