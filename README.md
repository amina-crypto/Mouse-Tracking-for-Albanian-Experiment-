Here’s a clear and concise **README** file tailored for your **Albanian mouse tracking experiment** that uses the **MoTR** tool and contains **the same texts as the WebQam Gazer experiment** (from the [WebQamGaze-Fresh-Albania-exp](https://github.com/amina-crypto/WebQamGaze-Fresh-Albania-exp) repository).

---

# 🖱️ MoTR-Albanian Experiment (Mouse Tracking for Albanian Reading Data)

This repository contains a setup to run **MoTR (Mouse Tracking for Reading)** experiments in **Albanian**, using the **same texts** as the **WebQam Gazer experiment**, originally designed for eye-tracking in Albanian.

The purpose of this experiment is to collect **mouse-based reading behavior data** in Albanian, using the **MoTR** framework (based on the Magpie experiment runner), and later process it into behavioral features such as **gaze duration, go-past time, total duration**, etc.

---

## 🗂️ Repository Structure

```
.
├── data/
│   ├── trials/                   # Contains trial items (.tsv or .csv) in Albanian
│   └── raw/                      # Raw MoTR mouse tracking data (after collection)
├── src/                          # MoTR experiment code (adapted from MoTR repo)
├── postprocessing/
│   ├── postprocessing.py         # Main script to process MoTR mouse tracking data
│   ├── utils/                    # Helper modules
│   └── outputs/                  # Processed data: fixations, reading times, etc.
├── README.md                     # This file
```

---

## 🧪 What This Repo Contains

* **Albanian texts** from the WebQam Gazer eye-tracking experiment (in `.csv` or `.tsv` format)
* A full pipeline for running a **mouse tracking experiment** using **MoTR** and **Magpie**
* Scripts to **post-process** collected mouse tracking data and extract behavioral reading measures

---

## 🚀 Running the MoTR Experiment

### 1. Install Dependencies

* Download and install **Node.js v16.20.2** [Download Link](https://nodejs.org/download/release/v16.20.2/)
* Clone this repo:

  ```bash
  git clone https://github.com/YOUR-USERNAME/MoTR-Albanian-Exp.git
  cd MoTR-Albanian-Exp/src/
  ```

### 2. Install Experiment Runner (Magpie-based)

Run the setup script (uses lightweight Magpie):

```bash
sh update_modules.sh
```

Alternatively, install manually:

```bash
npm install
npm run serve
```

### 3. Start the Experiment

Run locally:

```bash
npm run serve
```

Open your browser and click the `-Local:` link from the terminal.

---

## 🧪 Trial Data Format (CSV or TSV)

The trial data files in `data/trials/` contain:

* **Albanian texts** from WebQam Gazer experiments (same sentence materials)
* Optional: comprehension questions and correct/incorrect answers

Each row = one trial sentence with metadata.

---

## 🧹 Postprocessing MoTR Data

After collecting reading data:

### Example:

```bash
python3 postprocessing/postprocessing.py \
  --in_file data/raw/albanian_reading_data.csv \
  --trial_file data/trials/albanian_texts.tsv
```

This script:

* Divides data by participant
* Extracts fixation sequences
* Computes reading measures like:

  * Gaze Duration
  * Go Past Time
  * Total Reading Time
  * Regression Probabilities

Processed outputs are saved under:

```
./divided/
./fixations/
./reading_measures/
```

---

## 🧪 Features Extracted

* Gaze Duration
* Total Duration
* Go Past Time
* First Pass Regression
* Skipping & regressions
* Sentence-level metrics

These can be used to train **linguistic models**, compare against eye-tracking (WebQam Gazer), or validate sentence processing in Albanian.

---

## 📌 Relation to WebQam Gazer

This experiment **reuses the exact same sentence materials** from:
👉 [WebQamGaze-Fresh-Albania-exp](https://github.com/amina-crypto/WebQamGaze-Fresh-Albania-exp)

However, it collects **mouse movement data** (not gaze), making it:

* Cheaper and easier to deploy
* Useful for behavioral-linguistic modeling in **low-resource languages** like Albanian

---

## 📈 Goals

* Demonstrate the applicability of MoTR for underrepresented languages like **Albanian**
* Provide a **low-cost alternative** to eye-tracking using **mouse data**
* Build **machine learning-ready** datasets for tasks like:

  * Dependency parsing
  * PoS tagging
  * Word complexity estimation

---

## 📚 References

* MoTR: [https://github.com/wilcoxeg/MoTR](https://github.com/wilcoxeg/MoTR)
* WebQam Gazer Albanian: [https://github.com/amina-crypto/WebQamGaze-Fresh-Albania-exp](https://github.com/amina-crypto/WebQamGaze-Fresh-Albania-exp)
* Wilcox et al. (2024). *Mouse Tracking for Reading Studies*

---

Let me know if you'd like a **custom bash script** to automate data processing or a **Jupyter Notebook** version for easier exploration.
