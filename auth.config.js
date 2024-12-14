import routes from "@/data/routes.json";
const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: routes.login.path,
  },
  providers: [],
};

export default authConfig;
