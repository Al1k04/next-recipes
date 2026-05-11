"use client";

import RecipeCard from "@/common/recipe-card";
import { useRecipeStore } from "@/store/recipe.store";
import { Button, Alert, CircularProgress, Box, Grid } from "@mui/material";
import Link from "next/link";

export default function Home() {
  const { recipes, isLoading, error } = useRecipeStore();

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Link href="/recipes/new" passHref>
          <Button variant="contained" color="primary">
            Add Recipe
          </Button>
        </Link>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid item key={recipe.id} xs={12} sm={6} lg={4}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
