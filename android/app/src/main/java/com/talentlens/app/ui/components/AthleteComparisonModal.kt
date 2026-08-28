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
import androidx.compose.material.icons.filled.CompareArrows
import androidx.compose.material.icons.filled.Share
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
fun AthleteComparisonModal(
    athletes: List<AssessmentResult>,
    onDismiss: () -> Unit
) {
    if (athletes.size < 2) return
    val context = LocalContext.current

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = BackgroundDark),
            modifier = Modifier
                .fillMaxWidth()
                .padding(4.dp)
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
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.CompareArrows, contentDescription = null, tint = CyberCyan)
                        Text("Head-to-Head Comparison", color = TextPrimary, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = TextSecondary)
                    }
                }

                Text("Comparing ${athletes.size} shortlisted prospects side-by-side", color = TextSecondary, fontSize = 11.sp, fontFamily = FontFamily.Monospace)

                Divider(color = CardBorder)

                // Side-by-Side Dossier Cards
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    athletes.forEach { a ->
                        Surface(
                            color = CardBackground,
                            shape = RoundedCornerShape(16.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                Text(a.athleteName, color = TextPrimary, fontSize = 14.sp, fontWeight = FontWeight.Bold, maxLines = 1)
                                Text("${a.district}, ${a.state}", color = TextSecondary, fontSize = 10.sp)
                                Text(a.sport.displayName, color = CyberCyan, fontSize = 10.sp, fontWeight = FontWeight.Bold)

                                Divider(color = CardBorder)

                                Text("SCORE", color = TextSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                Text("${a.score} ${a.exerciseType.metricUnit}", color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Black)

                                Text("PERCENTILE", color = BrandOrange, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                Text("${a.percentile.toInt()}%", color = BrandOrange, fontSize = 16.sp, fontWeight = FontWeight.Black)

                                Text("FORM", color = VerifiedEmerald, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                Text("${a.biomechanics.formScore}%", color = VerifiedEmerald, fontSize = 16.sp, fontWeight = FontWeight.Black)
                            }
                        }
                    }
                }

                // Share Comparison Button
                Button(
                    onClick = {
                        val text = athletes.joinToString("\n\n") { a ->
                            "${a.athleteName} (${a.state}) | ${a.sport.displayName} | Score: ${a.score} | National %ile: ${a.percentile.toInt()}% | Form: ${a.biomechanics.formScore}%"
                        }
                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, "TalentLens Comparison Matrix:\n\n$text")
                        }
                        context.startActivity(Intent.createChooser(shareIntent, "Share Scout Comparison"))
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandOrange),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth().height(48.dp)
                ) {
                    Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Share Comparison Report", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
