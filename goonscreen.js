var config = {
  content: [
    {
      type: "column",
      isClosable: false,
      content: [
        {
          type: "row",
          isClosable: false,
          content: [],
        },
      ],
    },
  ],
};

var myLayout = new window.GoldenLayout(config, $("#layoutContainer"));

myLayout.registerComponent("example", function (container, state) {
  if (state.text.includes(".webm")) {
    var videoContainer = $('<div class="video-container"></div>');
    var videoElement = $(
      '<video controls loop><source src="' +
        state.text +
        '" type="video/webm"></video>'
    )[0];
    videoContainer.append(videoElement);
    container.getElement().append(videoContainer);
    // Attempt to play with sound
    var playPromise = videoElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          // Autoplay started
        })
        .catch((error) => {
          // Autoplay was prevented, mute and try again
          videoElement.muted = true;
          videoElement.play();
        });
    }
  } else {
    container.getElement().html("<h2>" + state.text + "</h2>");
  }
});

myLayout.init();

const MAX_VIDEOS_PER_ROW = 4;
const TOTAL_VIDEOS = 2320;

// Function to handle playing the video
function playVideo(videoNumber) {
  console.log("Playing video number:", videoNumber); // Debugging log
  // Ensure videoNumber is a string
  videoNumber = videoNumber.toString().replace(/^0+/, '') || '0';
  var videoPath = "videos/" + videoNumber + ".webm";
  fetch(videoPath, { method: "HEAD" })
    .then(function (response) {
      if (response.ok) {
        var column = myLayout.root.contentItems[0];
        var currentRow = column.contentItems[column.contentItems.length - 1];
        if (currentRow.contentItems.length < MAX_VIDEOS_PER_ROW) {
          // Add to the current row if it's not full
          var newItemConfig = {
            title: "GOONSCREEN " + videoNumber,
            type: "component",
            componentName: "example",
            componentState: { text: videoPath },
          };
          currentRow.addChild(newItemConfig);
        } else {
          // Create a new row if the current one is full
          var newRowConfig = {
            type: "row",
            isClosable: false,
            content: [
              {
                title: "GOONSCREEN " + videoNumber,
                type: "component",
                componentName: "example",
                componentState: { text: videoPath },
              },
            ],
          };
          column.addChild(newRowConfig);
        }
      } else {
        alert("Video not found");
      }
    })
    .catch(function () {
      alert("Error checking video file");
    });
}

// Event listener for the holy goon button :D
document.getElementById("confirmButton").addEventListener("click", function () {
  var videoNumber = document.getElementById("videoInput").value;
  playVideo(videoNumber);
  document.getElementById("videoInput").value = ""; // Clear the search bar
});

// Event listener for pressing enter in search field
document.getElementById("videoInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    var videoNumber = document.getElementById("videoInput").value;
    playVideo(videoNumber);
    document.getElementById("videoInput").value = ""; // Clear the search bar
  }
});

// another event listener for the random search button
document.getElementById("randomButton").addEventListener("click", function () {
  var randomVideoNumber = Math.floor(Math.random() * TOTAL_VIDEOS) + 1;
  console.log("Random video number:", randomVideoNumber); // Debugging log
  playVideo(randomVideoNumber.toString());
});

// Function to remove the most recently played video
function removeLastVideo() {
  var column = myLayout.root.contentItems[0];
  var currentRow = column.contentItems[column.contentItems.length - 1];
  if (currentRow.contentItems.length > 0) {
    currentRow.removeChild(currentRow.contentItems[currentRow.contentItems.length - 1]);
  } else if (column.contentItems.length > 1) {
    column.removeChild(currentRow);
  }
}

// Event listener for hotkeys
document.addEventListener("keydown", function (event) {
  if (event.key === "r") {
    // Play a random video when 'r' is pressed
    var randomVideoNumber = Math.floor(Math.random() * TOTAL_VIDEOS) + 1;
    playVideo(randomVideoNumber.toString());
  } else if (event.key === "d") {
    // Remove the most recently played video when 'd' is pressed
    removeLastVideo();
  }
});
