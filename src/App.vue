<template>
  <nav>
    <div>
      <img src="./assets/logo.png" alt="" />
    </div>
    <div class="links">
      <router-link to="/">Acceuil</router-link>
      <router-link to="/about">Rituels</router-link>
      <router-link to="/about">Conseil</router-link>
      <router-link to="/about">A Propos</router-link>
      <router-link to="/about">A Contact</router-link>
    </div>
  </nav>
  <router-view />
</template>

<style>
#app {
  back
}
img {
  margin-left: 50px;
  padding: 0%;
  height: 100px;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  background-color: hsl(15, 11%, 78%);
}

nav a {
  color: #ffffff;
  font-family: Baskervville;
  padding: 10px;
  background-color: #b96c53;
  border-radius: 14cap;
  text-decoration: none;
  margin: 10px;
}

nav a.router-link-exact-active {
  color: #ff0004;
}
</style>
