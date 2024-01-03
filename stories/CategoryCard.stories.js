import "../src/static/css/index.css";
import {
    CategoryCard
} from "../src/static/code/components/CategoryCard";

export default {
    title: "CategoryCard",
};

const Template = ({
    title,
    description
}) => `<category-card title="${title}" description="${description}"></category-card>`;

export const RegularCategoryCard = Template.bind({});
RegularCategoryCard.args = {
    title: "Title",
    description: "This is the description",
};