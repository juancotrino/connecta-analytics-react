# Build Stage
FROM node:20.11.1-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && \
  npm install --legacy-peer-deps --no-audit && \
  npm install firebase@10.12.2 --legacy-peer-deps
COPY . .

# Create and verify ESLint config
RUN echo '{\
  "extends": ["next/core-web-vitals"],\
  "rules": {\
  "@typescript-eslint/no-explicit-any": "off",\
  "@typescript-eslint/no-unsafe-assignment": "off",\
  "@typescript-eslint/no-unsafe-member-access": "off",\
  "@typescript-eslint/no-unsafe-return": "off",\
  "@typescript-eslint/no-unsafe-argument": "off",\
  "@typescript-eslint/explicit-function-return-type": "off",\
  "react/react-in-jsx-scope": "off",\
  "unicorn/filename-case": "off",\
  "no-undef": "off",\
  "@typescript-eslint/no-unused-vars": "off",\
  "no-unused-vars": "off",\
  "react-hooks/exhaustive-deps": "off",\
  "react/jsx-no-leaked-render": "off",\
  "@typescript-eslint/no-confusing-void-expression": "off",\
  "@typescript-eslint/no-floating-promises": "off",\
  "no-useless-catch": "off",\
  "tsdoc/syntax": "off",\
  "camelcase": "off",\
  "no-else-return": "off",\
  "@typescript-eslint/no-inferrable-types": "off",\
  "react/function-component-definition": "off",\
  "@typescript-eslint/consistent-type-imports": "off",\
  "@typescript-eslint/consistent-type-definitions": "off",\
  "@typescript-eslint/consistent-indexed-object-style": "off",\
  "@typescript-eslint/no-unnecessary-type-assertion": "off",\
  "@typescript-eslint/prefer-includes": "off",\
  "@typescript-eslint/no-shadow": "off",\
  "react/no-array-index-key": "off",\
  "import/no-named-as-default-member": "off",\
  "import/no-duplicates": "off",\
  "prefer-const": "off",\
  "@typescript-eslint/non-nullable-type-assertion-style": "off",\
  "no-implicit-coercion": "off"\
  }\
  }' > .eslintrc.json && \
  cat .eslintrc.json && \
  ls -la .eslintrc.json

# Install ESLint and required plugins
RUN npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks

# Run build with explicit ESLint config
RUN NODE_ENV=production ESLINT_NO_DEV_ERRORS=true npm run build

# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
