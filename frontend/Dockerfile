FROM nginx:alpine

# Copy HTML files to nginx html directory
COPY frontend.html /usr/share/nginx/html/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]