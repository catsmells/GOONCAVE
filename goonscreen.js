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
    const TOTAL_VIDEOS = 2170;
    document
      .getElementById("confirmButton")
      .addEventListener("click", function () {
        var videoNumber = document.getElementById("videoInput").value;
        var videoPath = "videos/" + videoNumber + ".webm";
        fetch(videoPath, { method: "HEAD" })
          .then(function (response) {
            if (response.ok) {
              var column = myLayout.root.contentItems[0];
              var currentRow =
                column.contentItems[column.contentItems.length - 1];
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
      });
    document
  .getElementById("randomButton")
  .addEventListener("click", function () {
    var randomVideoNumber = Math.floor(Math.random() * TOTAL_VIDEOS) + 1;
    var videoPath = "videos/" + randomVideoNumber + ".webm";
    fetch(videoPath, { method: "HEAD" })
      .then(function (response) {
        if (response.ok) {
          var column = myLayout.root.contentItems[0];
          var currentRow =
            column.contentItems[column.contentItems.length - 1];

          if (currentRow.contentItems.length < MAX_VIDEOS_PER_ROW) {
            var newItemConfig = {
              title: "GOONSCREEN " + randomVideoNumber,
              type: "component",
              componentName: "example",
              componentState: { text: videoPath },
            };
            currentRow.addChild(newItemConfig);
          } else {
            var newRowConfig = {
              type: "row",
              isClosable: false,
              content: [
                {
                  title: "GOONSCREEN " + randomVideoNumber,
                  type: "component",
                  componentName: "example",
                  componentState: { text: videoPath },
                },
              ],
            };
            column.addChild(newRowConfig);
          }
        } else {
          alert("Random video not found");
        }
      })
      .catch(function () {
        alert("Error checking random video file");
      });
  });
