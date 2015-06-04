--[[------------------------------------------------------
  # buma MidiSync

  Provides a continuous value representing the song position by
  receiving midi "song" sync.

--]]------------------------------------------------------
local lub    = require 'lub'
local buma   = require 'buma'
local lens   = require 'lens'
local lmidi  = require 'lmidi'
local lib    = lub.class 'buma.MidiSync'

local DEFAULT_PORT = 'IAC Driver Bus 1'
local TIC_VALUE    = 1/24
local MIDI_SONG_TO_BEAT = 1/4 -- position is in 16th
local MIDI_NOTE_TO_BEAT = 1/4 -- one note every 16th to sync
local OP_TO_FUNC   = {}
local elapsed = lens.elapsed

-- # Class functions

-- Create a new midi sync object. If no `port_name` is provided, use
-- 'IAC Driver Bus 1'.
function lib.new(port_name, mode)
  local port_name = port_name or DEFAULT_PORT
  local self = {
    mi  = lmidi.In(port_name),
    pos = buma.Smoother(),
  }
  if mode == 'notes' then
    local fun = OP_TO_FUNC.NoteOn
    function self.mi.receive(_, msg)
      if msg.type == 'NoteOn' then
        if fun then fun(self, msg.note) end
      end
    end
  else
    self.mi:receiveType 'time'
    function self.mi.receive(_, msg)
      if msg.type == 'Clock' then
        local fun = OP_TO_FUNC[msg.op]
        if fun then fun(self, msg.position) end
      end
    end
  end
  
  setmetatable(self, lib)
  return self
end

-- # Methods

-- Return a continuous value representing the current song position.
function lib:position()
  return self.pos:value()
end

function OP_TO_FUNC:Tick()
  self.pos:addValue(TIC_VALUE)
end

function OP_TO_FUNC:Stop()
  self.pos:stop()
end

function OP_TO_FUNC:Start()
  self.pos:start()
end

function OP_TO_FUNC:Song(position)
  -- position is in midi 1/16th notes. 
  -- Jump to song position. Set directly to avoid messing with speed.
  self.pos.svalue = position * MIDI_SONG_TO_BEAT
  self.pos.svalue_ref = elapsed()
end

function OP_TO_FUNC:NoteOn(note)
  self.pos:setValue(note * MIDI_NOTE_TO_BEAT)
end

return lib
