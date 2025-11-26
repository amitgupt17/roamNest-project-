let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
let taxInfo = document.getElementsByClassName("taxInfo");
for (info of taxInfo) {
    if(info.style.display != "inline") {
    info.style.display = "inline";
    } else {
    info.style.display = "none";
    }
}
});
// Category
const allListingsContainer = document.getElementById("allListings");
const allCards = Array.from(allListingsContainer.querySelectorAll(".listing-card"));
const filters = document.querySelectorAll(".filter");

const noResultMsg = document.createElement("div");
noResultMsg.textContent = "No Nest found for this category.";
noResultMsg.style.textAlign = "center";
noResultMsg.style.fontSize = "1.2rem";
noResultMsg.style.color = "#777";
noResultMsg.style.marginTop = "2rem";
noResultMsg.style.display = "none";
allListingsContainer.parentElement.appendChild(noResultMsg);

// Default: show all listings
filters.forEach((filter) => {
filter.addEventListener("click", () => {
    const categoryName = filter.querySelector("p").textContent.trim();

    // Clear all cards first
    allListingsContainer.innerHTML = "";
    noResultMsg.style.display = "none"; // hide message first
    
    // Filter cards based on category
    listings.forEach((listing, index) => {
    if (listing.category === categoryName) {
        allListingsContainer.appendChild(allCards[index]);
    }
    });

    // If no category matches, show all again (optional)
    if (allListingsContainer.children.length === 0) {
    noResultMsg.style.display = "block";
    }
});
});