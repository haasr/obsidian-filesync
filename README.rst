*****************
obsidian-filesync
*****************

Node.js wrapper that syncs your notes to a Git repository for free cloud storage.


.. contents:: Contents


The Scenario
############

I **love** using Obsidian but I *hate* copying images and markdown files -- or worse --
different *versions* of markdown files from the Obsidian directory on my laptop
to that of my desktop computer or vice versa. I really don't want to pay a monthly
subscription to use cloud storage for my notes. If only there were a free version
control service already out there... Oh wait, there's GitHub!

This simple program is designed to act as a wrapper for Obsidian. Launching it
triggers a ``git pull`` to pull down any changes to files, folders, or editor
preferences from the last time you used Obsidian on a device. When you close
the window, a listener calls ``git push`` to push your changes.

* NOTE: I only designed this to work with ONE Obsidian file vault.


Disclaimer
############

This is not enterprise-grade software! There is a listener waiting until you
close Obsidian to push the files. If you close Obsidian and immediately shut the
lid of your laptop (or disconnect from the Internet somehow), you might disturb
that process.

It is possible that a ``git pull`` will fail, if for instance, Obsidian crashed
or the code failed to push changes on one of your devices and then you made
changes from another device. I tried to avoid this by including a lock file,
but it is not fullproof. Therefore, I recommend *avoiding* this tool unless you
are familiar with managing git repos (e.g., pulling and pushing, fixing merge
conflicts). If a kind developer with free time would like to look over my code
and write pull requests to improve it, that would be much appreciated.


Requirements
############

- Internet connection on the client devices that use Obsidian.
- ``git`` command line tool installed and available through the PATH.
- Node.js v16.13.0+ installed.
- Basic knowledge of git and version control.


Setup
#####

1) Copy your Obsidian vault contents into a repo
------------------------------------------------

Move your entire Obsidian vault into a Github or Bitbucket repository.
Consider the repository folder to be your vault's root folder, for example:

.. code:: bash

    ls -a obsidian-vault0/        <-- This is the repository name. This folder was created with a ``git clone``.

    124fig01.png.jpg                      'Pasted image 20220324113328.png'
    ...                                    ...

    .git/                                 'Pasted image 20220323160358.png'
    .gitignore                            'Pasted image 20220323160610.png'
    .obsidian/                            'Pasted image 20220323161826.png'
    .obsidian-filesync-lock               'Pasted image 20220323162305.png'
    'Pasted image 20220220130554.png'       Philosophy/
    'Pasted image 20220220130807.png'      'Programming for Data Analytics'/
    'Pasted image 20220220131057.png'       Quotes/
    'Pasted image 20220222183604.png'      'Research Methods'/
    'Pasted image 20220228143327.png'       Scripts/
    'Pasted image 20220228153349.png'      'Software Project Management'/
    'Pasted image 20220228154537.png'      'Software Systems Engineering'/
    'Pasted image 20220303205435.png'      'Teaching Assistantship'/
    'Pasted image 20220303210047.png'      'TODO Lists'/


2) Add a .gitignore file
----------------------------------------

Add a .gitignore file to your new Obsidian vault repository to ignore
files you may not wish to change accross devices that will be pulling down
the repository. Here are the contents of mine:

.obsidian/app.json
.obsidian/appearance.json
.obsidian/core-plugins-migration.json
.obsidian/core-plugins.json
.obsidian/hotkeys.json


3) Add a lock file and push your vault
----------------------------------------

Add an empty file named ``.obsidian-filesync.lock``. Just like the gitignore file,
this file will reside in the root of your repository, not in a subfolder.

Now you are ready to push your vault up to your origin. After you push it, you
need to ensure that you can push and pull without using a password. The easiest
way is to configure ``git`` to use SSH, rather than a password. You can refer to
this tutorial (https://blog.corsego.com/aws-cloud9-github-ssh).


4) Setup this project
----------------------------------------

First, clone this repository. Next, rename ``example-config.js`` to ``config.js``.
Edit the ``DEVICE_ID``, ``EXECUTABLE_PATH``, and ``VAULT_PATH`` strings according to
your paramaters. ``DEVICE_ID`` is necessarily unique accross different devices that
will be using ``obsidian-filesync``. My desktop's device ID is ``Win10Desktop`` and
my laptop's is ``Win10Laptop``. If I have Obsidian running on my desktop, then,
``obsidian-filesync`` will refuse to open it on the laptop (because of the lock
file) and command line output will tell me I need to close Obsidian on ``Win10Desktop``.


5) Install the Node dependencies
----------------------------------------

From the root directory of the ``obsidian-filesync`` repo, run ``npm install .``.
You also need to install ``electron``: ``npm install electron``.


6) Create Your Launcher Shortcut
----------------------------------------

Create a desktop shortcut to ``obsidian-filesync.vbs`` (Windows) or create a
desktop file for Linux (or whatever you do on a Mac). On my distro
(Linux Mint), I can create a desktop file in ``/usr/share/applications`` to execute
my launcher script (see https://forums.linuxmint.com/viewtopic.php?p=2044773).

Make sure that the path in your launcher file (``obsidian-filesync.*``) is
modified to be the full path to where you have cloned ``obsidian-filesync``.
Name your shortcut something UNIQUE to distinguish it from the ordinary Obsidian
launcher (I named mine "Obsidian (sync)").

* NOTE: From now on, you only want to launch Obsidian through the launcher.
Launching it the default way would not sync with your git repository and then
you may have merge conflicts later. On Windows, the shell can be hidden by
changing the ``1`` in ``obsidian-filesync.vbs`` to ``0``. Note that this will hide
error messages about connection issues or the need to close Obsidian on another
device before launching. So if Obsidian won't launch, you need to launch this
program in a terminal so you can debug the problem.

