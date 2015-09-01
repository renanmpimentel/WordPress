/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */
// Adds the systems that shape your system
systems({
  WordPress: {
    // Dependent systems
    depends: ["mysql"],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/php-fpm"},
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    wait: {"retry": 20, "timeout": 1000},
    mounts: {
      '/azk/#{manifest.dir}': path("."),
    },
    scalable: {"default": 1},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      // exports global variables
      http: "80/tcp",
    },
    envs: {
      // Make sure that the PORT value is the same as the one
      // in ports/http below, and that it's also the same
      // if you're setting it in a .env file
      APP_DIR: "/azk/#{manifest.dir}",
    },
  },

  mysql: {
    // Dependent systems
    depends: [],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/mysql:5.6"},
    shell: "/bin/bash",
    wait: {"retry": 25, "timeout": 1000},
    mounts: {
      '/var/lib/mysql': persistent("mysql_#{manifest.dir}"),
    },
    ports: {
      // exports global variables
      data: "3306:3306/tcp",
    },
    envs: {
      // set instances variables
      MYSQL_ROOT_PASSWORD: "wordpress",
      MYSQL_USER: "wordpress",
      MYSQL_PASS: "wordpress",
      MYSQL_DATABASE: "wordpress",
    },
    export_envs: {
      // check this gist to configure your database
      // https://gist.github.com/gullitmiranda/62082f2e47c364ef9617
      DATABASE_URL: "mysql2://#{envs.MYSQL_USER}:#{envs.MYSQL_PASS}@#{net.host}:#{net.port.data}/${envs.MYSQL_DATABASE}",
    },
  },
});
