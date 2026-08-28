package com.talentlens.app.ui.components

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.talentlens.app.model.AssessmentResult
import com.talentlens.app.ui.theme.*

@Composable
fun CertificateDialog(
    assessment: AssessmentResult,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = BackgroundDark),
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
                .border(2.dp, BrandOrange.copy(alpha = 0.5f), RoundedCornerShape(24.dp))
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Top Header Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Icon(Icons.Default.Verified, contentDescription = null, tint = VerifiedEmerald, modifier = Modifier.size(20.dp))
                        Text("OFFICIAL CREDENTIAL", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = TextSecondary)
                    }
                }

                // Inner Certificate Frame
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(CardBackground, RoundedCornerShape(16.dp))
                        .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("TALENTLENS PROTOCOL", color = BrandOrange, fontSize = 18.sp, fontWeight = FontWeight.Black, letterSpacing = 2.sp)
                    Text("National Sports Talent Assessment Certificate", color = TextSecondary, fontSize = 11.sp, textAlign = TextAlign.Center)

                    Divider(color = CardBorder, thickness = 1.dp)

                    Text(assessment.athleteName.uppercase(), color = TextPrimary, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, textAlign = TextAlign.Center)
                    Text("${assessment.district}, ${assessment.state} • ${assessment.age} Yrs • ${assessment.sport.displayName}", color = TextSecondary, fontSize = 12.sp)

                    // Big Score & Percentile Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("SCORE", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text("${assessment.score} ${assessment.exerciseType.metricUnit}", color = TextPrimary, fontSize = 24.sp, fontWeight = FontWeight.Black)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("PERCENTILE", color = BrandOrange, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text("${assessment.percentile.toInt()}%", color = BrandOrange, fontSize = 24.sp, fontWeight = FontWeight.Black)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("FORM QUALITY", color = VerifiedEmerald, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text("${assessment.biomechanics.formScore}%", color = VerifiedEmerald, fontSize = 24.sp, fontWeight = FontWeight.Black)
                        }
                    }

                    // Classification Tier Badge
                    Surface(
                        color = Color(assessment.talentTier.badgeColorHex).copy(alpha = 0.15f),
                        shape = RoundedCornerShape(12.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(assessment.talentTier.badgeColorHex).copy(alpha = 0.5f))
                    ) {
                        Text(
                            text = assessment.talentTier.displayName,
                            color = Color(assessment.talentTier.badgeColorHex),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        )
                    }

                    Text("Verification Hash: ${assessment.verificationHash}", color = TextSecondary, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                }

                // Share Button
                Button(
                    onClick = {
                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(
                                Intent.EXTRA_TEXT,
                                "TalentLens Verified Certificate: ${assessment.athleteName} achieved ${assessment.percentile.toInt()}th national percentile in ${assessment.exerciseType.title}! Hash: ${assessment.verificationHash}"
                            )
                        }
                        context.startActivity(Intent.createChooser(shareIntent, "Share Assessment Credential"))
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandOrange),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Share Official Credential", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
