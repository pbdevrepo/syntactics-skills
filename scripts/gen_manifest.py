#!/usr/bin/env python3
"""Generate manifest.json mapping workflow names to their skill lists."""
import json, os, sys

output_dir = sys.argv[1] if len(sys.argv) > 1 else "."
skills_root = os.path.join(os.path.dirname(__file__), "..", "skills")

workflows = {}
for wf_dir in sorted(os.listdir(skills_root)):
    if wf_dir.endswith("-workflow"):
        wf_name = wf_dir[: -len("-workflow")]
        wf_path = os.path.join(skills_root, wf_dir)
        skills = sorted(
            d for d in os.listdir(wf_path)
            if d.startswith("sync-") and os.path.isdir(os.path.join(wf_path, d))
        )
        if skills:
            workflows[wf_name] = skills

manifest = {"workflows": workflows}
out_path = os.path.join(output_dir, "manifest.json")
with open(out_path, "w") as f:
    json.dump(manifest, f, indent=2)

total = sum(len(v) for v in workflows.values())
print(f"manifest.json: {len(workflows)} workflows, {total} skills -> {out_path}")
