"use client";

import { IRecipe } from "@/types/recipe";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  CircularProgress,
} from "@mui/material";
import { useRecipeStore } from "@/store/recipe.store";
import Link from "next/link";
import { useTransition } from "react";
import Image from "next/image";
import { UNIT_ABBREVIATIONS } from "@/constants/select-options";
import { useAuthStore } from "@/store/auth.store";

interface RecipeCardProps {
  recipe: IRecipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { removeRecipe } = useRecipeStore();
  const { isAuth } = useAuthStore();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await removeRecipe(recipe.id);
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    });
  };

  const getUnitLabel = (unit: string) => {
    const unitOption = UNIT_ABBREVIATIONS.find(
      (option) => option.value === unit,
    );
    return unitOption ? unitOption.label : unit.toLowerCase();
  };

  return (
    <Card
      sx={{
        width: "100%",
        minWidth: 254,
        maxWidth: "md",
        height: 480,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <Box sx={{ height: 192, overflow: "hidden", flexShrink: 0 }}>
        {recipe.imageUrl ? (
          <Box
            sx={{
              position: "relative",
              height: 192,
              overflow: "hidden",
              borderBottom: "1px solid",
              borderColor: "grey.200",
              "&:hover img": { transform: "scale(1.05)" },
            }}
          >
            <Image
              src={recipe.imageUrl}
              alt="Recipe image"
              fill
              style={{
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "grey.200",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">No image</Typography>
          </Box>
        )}
      </Box>

      {/* Title */}
      <CardHeader
        title={
          <Typography variant="h6" fontWeight="bold">
            {recipe.name}
          </Typography>
        }
        sx={{ pb: 0 }}
      />

      {/* Body */}
      <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {recipe.description || "No description"}
        </Typography>

        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }}>
          Ingredients:
        </Typography>

        <List
          dense
          disablePadding
          sx={{ overflowY: "auto", maxHeight: 96, pl: 2 }}
        >
          {recipe.ingredients.map((ing) => (
            <ListItem
              key={ing.id}
              disablePadding
              sx={{ display: "list-item", listStyleType: "disc" }}
            >
              <Typography variant="body2">
                {ing.ingredient.name}: {ing.quantity}{" "}
                {getUnitLabel(ing.ingredient.unit)}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>

      {/* Actions */}
      {isAuth && (
        <CardActions sx={{ justifyContent: "flex-end", p: 2, gap: 1 }}>
          <Link href={`/recipes/${recipe.id}`} passHref>
            <Button variant="text" color="primary">
              Edit
            </Button>
          </Link>
          <Button
            variant="text"
            color="error"
            onClick={handleDelete}
            disabled={isPending}
            startIcon={
              isPending ? <CircularProgress size={14} color="inherit" /> : null
            }
          >
            Delete
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default RecipeCard;
