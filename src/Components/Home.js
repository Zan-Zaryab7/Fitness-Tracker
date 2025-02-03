import { Container, Typography, Box, Button, Grid, Card, CardContent } from "@mui/material";
import { FitnessCenter, Timeline, DirectionsRun } from "@mui/icons-material";
import { Footer } from "./Footer";
import { Header } from "./Header";

export default function Home() {
    return (
        <Box>
            <Header />
            <Container maxWidth="lg" sx={{ mt: '12.3%', minHeight: '62vh' }}>
                <Box textAlign="center" mb={5}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Welcome to Fitness Tracker
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        Track your workouts, monitor progress, and achieve your fitness goals.
                    </Typography>
                    <Button variant="contained" size="large" sx={{ mt: 3,backgroundColor:'#1a1a1a' }}>
                        Get Started
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ textAlign: "center", p: 3 }}>
                            <CardContent>
                                <FitnessCenter fontSize="large" color="primary" />
                                <Typography variant="h6" fontWeight="bold" mt={2}>
                                    Workout Tracking
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Log your exercises and monitor your training progress easily.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card sx={{ textAlign: "center", p: 3 }}>
                            <CardContent>
                                <Timeline fontSize="large" color="primary" />
                                <Typography variant="h6" fontWeight="bold" mt={2}>
                                    Progress Insights
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Get detailed reports and analytics on your fitness journey.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card sx={{ textAlign: "center", p: 3 }}>
                            <CardContent>
                                <DirectionsRun fontSize="large" color="primary" />
                                <Typography variant="h6" fontWeight="bold" mt={2}>
                                    Step & Calorie Tracker
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Track your daily steps and calorie burn with ease.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
}
