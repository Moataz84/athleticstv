let width = document.querySelector(".slider-container").getBoundingClientRect().width

const slider = document.querySelector(".slider")
const caption = document.querySelector(".caption")

let posts = JSON.parse(slider.getAttribute("data-posts"))
slider.removeAttribute("data-posts")

caption.innerHTML = posts[0].caption
slider.insertAdjacentHTML(
  "beforeend",
  `<div class="slide">
    <img src="${posts[0].photo}?tr=w-${width}">
  </div>
  <div class="slide">
    <img src="${posts.length < 2? posts[0].photo : posts[1].photo}?tr=w-${width}">
  </div>`
)

setInterval(() => {
  posts = posts.filter(post => (new Date(post.createdAt).getTime() + 604800000) > new Date().getTime() || !post.expire)
  const urlParts = new URL(slider.children[1].querySelector("img").getAttribute("src"))
  const current = urlParts.href.replace(urlParts.search, "")
  const next = posts.findIndex(post => post.photo === current) + 1
  const nextImage = posts[next] != undefined? posts[next].photo : posts[0].photo
  const nextCaption = posts[next - 1] != undefined? posts[next - 1].caption : posts[0].caption

  slider.style.animation = "move-slider 1.5s ease-in-out forwards"
  const timeout = setTimeout(() => {
    document.querySelector(".ql-editor").innerHTML = nextCaption
    slider.style.animation = ""
    slider.children[0].remove()
    slider.insertAdjacentHTML(
      "beforeend", 
      `<div class="slide">
        <img src="${nextImage}?tr=w-${width}">
      </div>`
      )
    clearTimeout(timeout)
  }, 1500)
}, 5000)

socket.on("post-created", data => {
  posts = [...posts, data]
})

socket.on("post-approved", data => {
  posts = data
})

socket.on("post-deleted", postId => {
  posts = posts.filter(post => post.postId !== postId)
})

socket.on("post-updated", data => {
  const post = posts.find(post => post.postId === data.postId)
  post.photo = data.photo
  post.caption = data.caption
})