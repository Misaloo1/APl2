import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

const NewsCard = ({ title, description, image, url }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      {image && (
        <CardMedia component="img" height="140" image={image} alt={title} />
      )}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={url} target="_blank" rel="noopener">
          Read More
        </Button>
        <Button variant="contained">Share</Button>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
